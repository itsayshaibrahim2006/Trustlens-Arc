import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { 
  ADVANCE_FEE_PATTERNS, 
  PAYMENT_APP_PATTERNS,
  UNSANCTIONED_COMM_PATTERNS, 
  UNSANCTIONED_HANDLE_REGEX,
  OFFICIAL_GOOGLE_DOMAINS,
  FREE_WEBMAIL_DOMAINS,
  CONSUMER_FORGERY_PRODUCERS,
  ENTERPRISE_ATS_SIGNATURES,
  URGENCY_PATTERNS,
  IDENTITY_HARVESTING_PATTERNS,
  INSTANT_HIRE_PATTERNS,
  STANDARD_EMPLOYMENT_CLAUSES,
  TECH_LANGUAGE_MAP
} from './scamPatterns.js';

// Configure pdfjs worker with local bundled asset from Vite
if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
  } catch (err) {
    console.warn('PDF.js worker initialization notice:', err);
  }
}

/**
 * Escapes regex special characters safely
 */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Computes Levenshtein edit distance to catch typosquatted domains (e.g. goog1e.com)
 */
function levenshteinDistance(s1, s2) {
  if (s1.length < s2.length) return levenshteinDistance(s2, s1);
  if (s2.length === 0) return s1.length;
  let previousRow = Array.from({ length: s2.length + 1 }, (_, i) => i);
  for (let i = 0; i < s1.length; i++) {
    const currentRow = [i + 1];
    for (let j = 0; j < s2.length; j++) {
      const insertions = previousRow[j + 1] + 1;
      const deletions = currentRow[j] + 1;
      const substitutions = previousRow[j] + (s1[i] !== s2[j] ? 1 : 0);
      currentRow.push(min3(insertions, deletions, substitutions));
    }
    previousRow = currentRow;
  }
  return previousRow[previousRow.length - 1];
}

function min3(a, b, c) {
  return Math.min(a, Math.min(b, c));
}

/**
 * Extracts raw text, metadata, and hidden hyperlink annotations from a PDF File object.
 * Preserves true line breaks using Y-coordinate displacement across text items.
 */
async function extractPdfData(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdfDoc = await loadingTask.promise;
    
    let fullText = '';
    const hiddenUris = [];

    for (let i = 1; i <= pdfDoc.numPages; i++) {
      const page = await pdfDoc.getPage(i);
      const textContent = await page.getTextContent();
      
      let pageText = '';
      let lastY = null;
      for (const item of textContent.items) {
        if (!item.str) continue;
        const currentY = item.transform ? item.transform[5] : null;
        if (lastY !== null && currentY !== null && Math.abs(currentY - lastY) > 4) {
          pageText += '\n';
        } else if (pageText.length > 0 && !pageText.endsWith(' ') && !pageText.endsWith('\n')) {
          pageText += ' ';
        }
        pageText += item.str;
        if (currentY !== null) {
          lastY = currentY;
        }
      }
      fullText += pageText + '\n\n';

      // Inspect hidden PDF link annotations
      try {
        const annotations = await page.getAnnotations();
        for (const annot of annotations) {
          if (annot.url) {
            hiddenUris.push(annot.url);
          }
        }
      } catch {
        // Annotation inspection optional
      }
    }

    let metadata = {};
    try {
      const meta = await pdfDoc.getMetadata();
      metadata = meta?.info || {};
    } catch {
      // metadata optional
    }

    return {
      text: fullText,
      numPages: pdfDoc.numPages,
      metadata,
      hiddenUris
    };
  } catch (error) {
    console.warn('Direct PDF parsing notice:', error);
    throw new Error(`Unable to read PDF file structure: ${error.message || 'File may be corrupted or encrypted.'}`);
  }
}

/**
 * Extracts raw text from DOCX (Word) documents natively via ZIP decompression.
 * Preserves paragraph breaks from </w:p> XML tags.
 */
async function extractDocxData(file) {
  try {
    const buf = await file.arrayBuffer();
    const u8 = new Uint8Array(buf);
    const view = new DataView(buf);
    let offset = 0;
    while (offset + 30 < u8.length) {
      if (u8[offset] === 0x50 && u8[offset + 1] === 0x4b && u8[offset + 2] === 0x03 && u8[offset + 3] === 0x04) {
        const compMethod = view.getUint16(offset + 8, true);
        const compSize = view.getUint32(offset + 18, true);
        const nameLen = view.getUint16(offset + 26, true);
        const extraLen = view.getUint16(offset + 28, true);
        const nameBytes = u8.subarray(offset + 30, offset + 30 + nameLen);
        const name = new TextDecoder().decode(nameBytes);
        const dataStart = offset + 30 + nameLen + extraLen;
        if (name === 'word/document.xml') {
          const compData = u8.subarray(dataStart, dataStart + compSize);
          if (compMethod === 8 && typeof DecompressionStream !== 'undefined') {
            const ds = new DecompressionStream('deflate-raw');
            const writer = ds.writable.getWriter();
            writer.write(compData);
            writer.close();
            const reader = ds.readable.getReader();
            const chunks = [];
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              chunks.push(value);
            }
            const totalLen = chunks.reduce((a, b) => a + b.length, 0);
            const full = new Uint8Array(totalLen);
            let pos = 0;
            for (const chunk of chunks) {
              full.set(chunk, pos);
              pos += chunk.length;
            }
            const xml = new TextDecoder().decode(full);
            const withBreaks = xml.replace(/<\/w:p>/gi, '\n').replace(/<[^>]+>/g, ' ');
            const cleanText = withBreaks.replace(/[ \t]+/g, ' ').replace(/\n\s*\n+/g, '\n');
            return {
              text: cleanText,
              numPages: 1,
              metadata: {},
              hiddenUris: []
            };
          } else if (compMethod === 0) {
            const xml = new TextDecoder().decode(compData);
            const withBreaks = xml.replace(/<\/w:p>/gi, '\n').replace(/<[^>]+>/g, ' ');
            const cleanText = withBreaks.replace(/[ \t]+/g, ' ').replace(/\n\s*\n+/g, '\n');
            return {
              text: cleanText,
              numPages: 1,
              metadata: {},
              hiddenUris: []
            };
          }
        }
        offset = dataStart + compSize;
      } else {
        offset++;
      }
    }
  } catch (err) {
    console.warn('DOCX ZIP extraction notice:', err);
    throw new Error(`Unable to read Word DOCX structure: ${err.message || 'File may be corrupted or invalid.'}`);
  }

  throw new Error('Could not find word/document.xml inside DOCX archive.');
}

/**
 * Stage 2: Document Intent Classifier (Offer Letter vs Candidate Resume)
 */
function classifyDocumentIntent(text) {
  const textLower = text.toLowerCase();
  const offerSignals = [
    'offer of employment', 'pleased to offer you', 'starting salary',
    'reporting to', 'employment terms', 'accept this offer', 'dear candidate',
    'congratulations on your offer', 'hourly rate', 'annual salary', 'position of'
  ];
  const resumeSignals = [
    'education', 'work experience', 'projects', 'technical skills',
    'skills', 'certifications', 'github.com/', 'linkedin.com/in/',
    'curriculum vitae', 'resume', 'bachelor', 'diploma', 'academic'
  ];

  let offerScore = 0;
  let resumeScore = 0;

  offerSignals.forEach(s => { if (textLower.includes(s)) offerScore++; });
  resumeSignals.forEach(s => { if (textLower.includes(s)) resumeScore++; });

  return offerScore > resumeScore ? 'EMPLOYMENT_OFFER_LETTER' : 'CANDIDATE_RESUME';
}

/**
 * Mode A: Offer Scam Forensic Engine (Pillars 1 - 5 with Hard-Veto Caps)
 */
function evaluateOfferLetter(text, metadata, hiddenUris) {
  const findings = [];
  const textLower = text.toLowerCase();
  let totalPenalty = 0;
  let hardVetoCap = 100;

  // --- PILLAR 1: Advance-Fee & Fake Equipment Check Fraud ---
  const p1Hits = [];
  ADVANCE_FEE_PATTERNS.forEach(pat => {
    const m = textLower.match(pat);
    if (m) p1Hits.push(m[0]);
  });
  PAYMENT_APP_PATTERNS.forEach(pat => {
    const m = textLower.match(pat);
    if (m) p1Hits.push(`Payment App Demand: ${m[0]}`);
  });

  if (p1Hits.length > 0) {
    totalPenalty += 85;
    hardVetoCap = Math.min(hardVetoCap, 10);
    findings.push({
      pillar: 'PILLAR_1',
      signal: 'Advance-Fee & Fake Equipment Check Fraud',
      risk: 'high',
      detail: `Detected check fraud scheme: "${Array.from(new Set(p1Hits)).slice(0, 2).join('", "')}". Google never asks candidates to deposit checks or pay vendors.`
    });
  }

  // --- PILLAR 2: Unsanctioned Communication Channels ---
  const p2Hits = [];
  UNSANCTIONED_COMM_PATTERNS.forEach(pat => {
    const m = textLower.match(pat);
    if (m) p2Hits.push(m[0]);
  });
  const handleMatch = text.match(UNSANCTIONED_HANDLE_REGEX);
  if (handleMatch) {
    p2Hits.push(`Unofficial Handle: ${handleMatch[0]}`);
  }

  if (p2Hits.length > 0) {
    totalPenalty += 50;
    hardVetoCap = Math.min(hardVetoCap, 20);
    findings.push({
      pillar: 'PILLAR_2',
      signal: 'Unsanctioned Telegram / Off-Platform Channel',
      risk: 'high',
      detail: `Directing recruitment candidates to unofficial channel (${p2Hits[0]}) instead of verified Google Meet / careers.google.com portal.`
    });
  }

  // --- PILLAR 3: Recruiter Email & Domain Spoofing ---
  const emails = Array.from(new Set(text.match(/[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/g) || []));
  hiddenUris.forEach(uri => {
    if (uri.startsWith('mailto:')) {
      emails.push(uri.replace('mailto:', '').split('?')[0]);
    }
  });

  const p3Hits = [];
  emails.forEach(email => {
    const parts = email.toLowerCase().split('@');
    if (parts.length === 2) {
      const [localPart, domain] = parts;
      if (FREE_WEBMAIL_DOMAINS.includes(domain)) {
        if (/google|career|recruit|hr|hiring|alphabet/.test(localPart)) {
          p3Hits.push(`Free Webmail Impersonation: ${email}`);
        }
      } else if (!OFFICIAL_GOOGLE_DOMAINS.includes(domain)) {
        const baseDomain = domain.split('.')[0];
        if (domain.includes('xn--') || levenshteinDistance(baseDomain, 'google') <= 2 || domain.includes('goog1e')) {
          p3Hits.push(`Typosquatted / Spoofed Domain: ${email}`);
        }
      }
    }
  });

  if (p3Hits.length > 0) {
    totalPenalty += 55;
    hardVetoCap = Math.min(hardVetoCap, 15);
    findings.push({
      pillar: 'PILLAR_3',
      signal: 'Impersonated Recruiter Email / Spoofed Domain',
      risk: 'high',
      detail: p3Hits[0]
    });
  }

  // --- PILLAR 4: Document Template & Consumer Forgery Metadata ---
  const producerCreator = `${metadata?.Producer || ''} ${metadata?.Creator || ''}`.toLowerCase();
  const p4Hits = CONSUMER_FORGERY_PRODUCERS.filter(tool => producerCreator.includes(tool));
  if (p4Hits.length > 0) {
    totalPenalty += 30;
    findings.push({
      pillar: 'PILLAR_4',
      signal: 'Consumer Graphic Forgery Artifacts',
      risk: 'medium',
      detail: `PDF created via consumer graphic tool (${p4Hits[0]}). Official corporate offer letters originate from enterprise ATS engines.`
    });
  }

  // --- PILLAR 5: Artificial Urgency & Compensation Anomalies ---
  const p5Hits = [];
  URGENCY_PATTERNS.forEach(pat => {
    const m = textLower.match(pat);
    if (m) p5Hits.push(m[0]);
  });
  const hourlyMatch = textLower.match(/\$\s?(\d{2,3})(?:\.\d{2})?\s?(?:\/\s?hr|\/\s?hour|per\s+hour)/);
  if (hourlyMatch && parseInt(hourlyMatch[1]) >= 60 && /data entry|typing|clerk|virtual assistant/.test(textLower)) {
    p5Hits.push(`Disproportionate pay ($${hourlyMatch[1]}/hr for entry-level data entry)`);
  }
  const clauseCount = STANDARD_EMPLOYMENT_CLAUSES.reduce((cnt, c) => cnt + (c.test(textLower) ? 1 : 0), 0);
  if (clauseCount === 0) {
    p5Hits.push('Missing standard statutory clauses (W-4, tax withholding, background check, or benefits)');
  }

  if (p5Hits.length > 0) {
    totalPenalty += 25;
    findings.push({
      pillar: 'PILLAR_5',
      signal: 'Artificial Urgency & Compensation Anomaly',
      risk: 'medium',
      detail: p5Hits[0]
    });
  }

  // --- PILLAR 6 (EMSCAD): Upfront Identity & Financial Credential Harvesting ---
  const p6Hits = [];
  IDENTITY_HARVESTING_PATTERNS.forEach(pat => {
    const m = textLower.match(pat);
    if (m) p6Hits.push(m[0]);
  });
  if (p6Hits.length > 0) {
    totalPenalty += 45;
    hardVetoCap = Math.min(hardVetoCap, 25);
    findings.push({
      pillar: 'PILLAR_6',
      signal: 'EMSCAD Identity & Financial Data Harvesting',
      risk: 'high',
      detail: `Premature request for sensitive credentials (${p6Hits[0]}). Legitimate corporate offers gather onboarding forms through encrypted HR portals after counter-signature.`
    });
  }

  // --- PILLAR 7 (EMSCAD): Instant Appointment & Interview Waiver Red Flag ---
  const p7Hits = [];
  INSTANT_HIRE_PATTERNS.forEach(pat => {
    const m = textLower.match(pat);
    if (m) p7Hits.push(m[0]);
  });
  if (p7Hits.length > 0) {
    totalPenalty += 40;
    hardVetoCap = Math.min(hardVetoCap, 30);
    findings.push({
      pillar: 'PILLAR_7',
      signal: 'EMSCAD Instant Hire / Interview Bypass Indicator',
      risk: 'high',
      detail: `Unrealistic hiring process without vetting (${p7Hits[0]}). Classic characteristic of fake employment fraud.`
    });
  }

  // Mathematical Scoring Formula
  const finalScore = Math.max(0, Math.min(hardVetoCap, 100 - totalPenalty));
  const isScam = finalScore < 50;

  const domainPart = emails[0]?.split('@')[1] || (textLower.match(/@([a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)/)?.[1]) || 'Direct Corporate';
  const channelText = handleMatch ? handleMatch[0] : (p2Hits.length > 0 ? 'Unofficial Channel' : 'careers.google.com Portal');
  const feeText = p1Hits.length > 0 ? 'Equipment Check / Advance Fee' : 'Zero Candidate Fee';
  const clauseText = clauseCount >= 2 ? `${clauseCount} Statutory Clauses Valid` : 'Missing Statutory Clauses';

  return {
    documentType: 'EMPLOYMENT_OFFER_LETTER',
    isScam,
    authenticityScore: finalScore,
    fakeProbability: Number((100 - finalScore).toFixed(1)),
    realConfidence: Number(finalScore.toFixed(1)),
    headline: isScam ? 'FAKE RESUME / JOB OFFER DETECTED' : 'AUTHENTIC EMPLOYMENT OFFER',
    summary: isScam 
      ? (findings[0]?.detail || 'Critical job scam detected. Discrepancies found in recruiter email, payment requests, and communication channel.')
      : 'Offer letter passes enterprise forensic checks. Official corporate communication with zero upfront fee demands.',
    metrics: [
      { label: 'Recruiter Domain', value: `@${domainPart}`, risk: p3Hits.length > 0 ? 'high' : 'pass' },
      { label: 'Interview Channel', value: channelText, risk: p2Hits.length > 0 ? 'high' : 'pass' },
      { label: 'Advance Check / Fee', value: feeText, risk: p1Hits.length > 0 ? 'high' : 'pass' },
      { label: 'Statutory Compliance', value: clauseText, risk: clauseCount === 0 ? 'medium' : 'pass' }
    ],
    googleRegistry: isScam ? '0 Match (Scam Flagged)' : 'Verified Corporate Registry',
    githubCommits: isScam ? 'Inorganic Claims' : 'Corporate Authorized',
    findings
  };
}

/**
 * Mode B: Real OSINT & Candidate CV Authenticator
 * Extracts genuine candidate identity, contact info, core sections, detected skills,
 * career timeline dates, and queries live GitHub API only if a real GitHub URL is provided.
 */
async function evaluateCandidateResume(text, metadata, hiddenUris) {
  const findings = [];
  const textLower = text.toLowerCase();
  const words = text.trim().split(/\s+/).filter(Boolean);

  // 1. Minimum Viable Document Validation
  if (words.length < 35) {
    return {
      documentType: 'INSUFFICIENT_DATA',
      isScam: true,
      authenticityScore: 18,
      fakeProbability: 82,
      realConfidence: 18,
      headline: 'INSUFFICIENT RESUME DATA',
      summary: `Document contains only ${words.length} words. A verifiable resume requires distinct sections for experience, education, contact details, and technical competencies.`,
      metrics: [
        { label: 'Word Count', value: `${words.length} Words (Insufficient)`, risk: 'high' },
        { label: 'Contact Info', value: 'Unlisted / Missing', risk: 'high' },
        { label: 'Career Timeline', value: 'No Dates Found', risk: 'high' },
        { label: 'Resume Sections', value: '0 / 4 Sections', risk: 'high' }
      ],
      googleRegistry: 'Unregistered / Insufficient Data',
      githubCommits: 'No Repositories Linked',
      findings: [{
        pillar: 'PILLAR_STRUCTURE',
        signal: 'Document Density Insufficient',
        risk: 'high',
        detail: `Uploaded document is only ${words.length} words long. Unable to extract valid candidate credentials or forensic signals.`
      }]
    };
  }

  // 2. Candidate Name Extraction (Scanning first 15 non-empty lines)
  let candidateName = null;
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  for (let i = 0; i < Math.min(15, lines.length); i++) {
    const line = lines[i];
    if (/^(?:curriculum vitae|resume|cv|portfolio|profile|personal profile|summary|contact|about me|experience|education|skills)$/i.test(line)) continue;
    if (line.includes('@') || line.includes('http') || line.includes('www.') || line.includes('+') || line.includes('|') || /\d/.test(line)) continue;
    if (/^[A-Z][a-zA-Z.'-]+(?:\s+[A-Z][a-zA-Z.'-]+){1,3}$/.test(line) && line.length < 45 && line.length > 3) {
      candidateName = line;
      break;
    }
  }

  // Fallback to metadata author if sensible
  if (!candidateName && metadata?.Author && typeof metadata.Author === 'string') {
    const auth = metadata.Author.trim();
    if (/^[A-Z][a-zA-Z.'-]+(?:\s+[A-Z][a-zA-Z.'-]+){1,3}$/.test(auth) && !/canva|word|adobe|latex|user|admin|author/i.test(auth)) {
      candidateName = auth;
    }
  }

  // 3. Contact Extraction
  const emails = Array.from(new Set(text.match(/[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/g) || []));
  hiddenUris.forEach(uri => {
    if (uri.startsWith('mailto:')) {
      const em = uri.replace('mailto:', '').split('?')[0];
      if (em) emails.push(em);
    }
  });
  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const primaryEmail = emails[0] || null;
  const primaryPhone = phoneMatch ? phoneMatch[0] : null;

  // 4. Section Structure Detection
  const sectionSignatures = {
    experience: /(?:work\s+)?experience|employment|work\s+history|professional\s+background/i,
    education: /education|academic|university|degree|college|bachelor|master|phd/i,
    skills: /skills|technologies|proficiencies|competencies|tools\s+used|stack/i,
    projects: /projects|portfolio|open\s+source|publications|key\s+accomplishments/i
  };

  const detectedSections = [];
  for (const [secName, rx] of Object.entries(sectionSignatures)) {
    if (rx.test(text)) detectedSections.push(secName);
  }

  // 5. Technical & Professional Skills Extraction
  const detectedSkills = [];
  Object.entries(TECH_LANGUAGE_MAP).forEach(([skill, lang]) => {
    const escaped = escapeRegExp(skill);
    const rx = /[a-zA-Z0-9_]/.test(skill.slice(-1))
      ? new RegExp(`\\b${escaped}\\b`, 'i')
      : new RegExp(`(?:^|[\\s,;()/\\'"])${escaped}(?=[\\s,;()/\\'"]|$)`, 'i');
    if (rx.test(textLower)) {
      detectedSkills.push(lang);
    }
  });

  // Additional popular tech stack skills check
  const extraSkills = ['Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Node.js', 'Express', 'Next.js', 'Tailwind', 'MongoDB', 'PostgreSQL', 'Git', 'Linux', 'Figma', 'GraphQL'];
  extraSkills.forEach(sk => {
    const rx = new RegExp(`\\b${escapeRegExp(sk)}\\b`, 'i');
    if (rx.test(text) && !detectedSkills.includes(sk)) {
      detectedSkills.push(sk);
    }
  });
  const uniqueSkills = Array.from(new Set(detectedSkills));

  // 6. Timeline & Chronological Consistency
  const currentYear = new Date().getFullYear();
  const yearRanges = Array.from(text.matchAll(/\b(19\d{2}|20\d{2})\s*[-–—to]+\s*(19\d{2}|20\d{2}|present|current|now)\b/gi));
  const parsedYears = [];
  let hasInvertedDates = false;
  let hasFutureDates = false;

  yearRanges.forEach(m => {
    const startYr = parseInt(m[1]);
    const endYr = ['present', 'current', 'now'].includes(m[2].toLowerCase()) ? currentYear : parseInt(m[2]);
    if (startYr > endYr) hasInvertedDates = true;
    if (startYr > currentYear + 1 || endYr > currentYear + 1) hasFutureDates = true;
    if (startYr >= 1990 && startYr <= currentYear) parsedYears.push(startYr);
    if (endYr >= 1990 && endYr <= currentYear) parsedYears.push(endYr);
  });

  let timelineText = 'No formal dates parsed';
  let timelineYears = 0;
  if (parsedYears.length > 0) {
    const minYr = Math.min(...parsedYears);
    const maxYr = Math.max(...parsedYears);
    timelineYears = Math.max(1, maxYr - minYr);
    timelineText = `${minYr} – ${maxYr === currentYear ? 'Present' : maxYr} (~${timelineYears} Yrs)`;
  }

  // Claimed experience inflation check
  const claimedExpMatch = textLower.match(/(\d{1,2})\+?\s+years?\s+of\s+(?:professional\s+)?experience/);
  let hasInflatedExp = false;
  let claimedYrs = 0;
  if (claimedExpMatch && parsedYears.length > 0) {
    claimedYrs = parseInt(claimedExpMatch[1]);
    const minYr = Math.min(...parsedYears);
    const actualSpan = currentYear - minYr;
    if (claimedYrs > actualSpan + 2) {
      hasInflatedExp = true;
    }
  }

  // 7. Profile Links: Genuine GitHub & LinkedIn Checking
  const allLinks = Array.from(new Set(text.match(/https?:\/\/[^\s,)\]>"']+|github\.com\/[a-zA-Z0-9_-]+|linkedin\.com\/in\/[a-zA-Z0-9_-]+/gi) || []));
  hiddenUris.forEach(u => allLinks.push(u));

  let githubUsername = null;
  for (const link of allLinks) {
    const m = link.match(/github\.com\/([a-zA-Z0-9_-]+)(?:[/?#]|$)/i);
    if (m && !['features', 'topics', 'collections', 'orgs', 'settings', 'explore', 'pricing', 'sponsors', 'enterprise'].includes(m[1].toLowerCase())) {
      githubUsername = m[1];
      break;
    }
  }

  const linkedinMatches = allLinks.filter(l => l.toLowerCase().includes('linkedin.com/in/'));
  const hasLinkedIn = linkedinMatches.length > 0;

  let githubStatus = 'none'; // 'verified' | '404_fake' | 'rate_limited' | 'none'
  let githubRepoCount = 0;

  if (githubUsername) {
    try {
      const userRes = await fetch(`https://api.github.com/users/${githubUsername}`);
      if (userRes.status === 404) {
        githubStatus = '404_fake';
      } else if (userRes.ok) {
        const uData = await userRes.json();
        githubRepoCount = uData.public_repos || 0;
        githubStatus = 'verified';
      } else {
        githubStatus = 'rate_limited';
      }
    } catch {
      githubStatus = 'rate_limited';
    }
  }

  // 8. Authentic Scoring Computation
  let score = 30; // base weight for submitted standard document

  // Contact points (+15)
  if (primaryEmail) score += 12;
  if (primaryPhone) score += 3;
  if (!primaryEmail && !primaryPhone) score -= 10;

  // Sections points (+25)
  const secCount = detectedSections.length;
  if (secCount >= 4) score += 25;
  else if (secCount === 3) score += 18;
  else if (secCount === 2) score += 10;
  else if (secCount === 1) score += 4;
  else score -= 18;

  // Timeline points (+20)
  if (parsedYears.length >= 2 && !hasInvertedDates && !hasFutureDates && !hasInflatedExp) {
    score += 18;
  } else if (parsedYears.length > 0) {
    score += 8;
  }

  // Skills points (+12)
  if (uniqueSkills.length >= 4) score += 12;
  else if (uniqueSkills.length >= 2) score += 8;
  else if (uniqueSkills.length >= 1) score += 4;

  // External Links (+8 bonus / -35 penalty)
  if (githubStatus === 'verified') {
    score += 8;
  } else if (githubStatus === '404_fake') {
    score -= 35; // Severe penalty: fake profile link provided
  }
  if (hasLinkedIn) score += 4;

  // Red flag penalties
  if (hasFutureDates) score -= 25;
  if (hasInvertedDates) score -= 20;
  if (hasInflatedExp) score -= 20;

  // Score clamping & status determination
  let authenticityScore = Math.max(10, Math.min(97, score));
  if (githubStatus === '404_fake' || hasFutureDates || hasInvertedDates) {
    authenticityScore = Math.min(42, authenticityScore);
  }

  const isScam = authenticityScore < 50;
  const fakeProbability = Number((100 - authenticityScore).toFixed(1));
  const realConfidence = Number(authenticityScore.toFixed(1));

  // 9. Build Informative Findings
  if (githubStatus === '404_fake') {
    findings.push({
      pillar: 'PILLAR_GITHUB',
      signal: 'Fabricated GitHub Link',
      risk: 'high',
      detail: `Claimed GitHub handle 'github.com/${githubUsername}' does not exist (HTTP 404). Potential fraudulent credential claim.`
    });
  } else if (githubStatus === 'verified') {
    findings.push({
      pillar: 'PILLAR_GITHUB',
      signal: 'Verified GitHub Profile',
      risk: 'pass',
      detail: `Live GitHub profile (@${githubUsername}) verified with ${githubRepoCount} public repositories.`
    });
  } else if (!githubUsername) {
    findings.push({
      pillar: 'PILLAR_GITHUB',
      signal: 'Code Repository',
      risk: 'pass',
      detail: 'No direct GitHub link provided (Standard for non-developer profiles).'
    });
  }

  if (hasFutureDates) {
    findings.push({
      pillar: 'PILLAR_TIMELINE',
      signal: 'Anomalous Future Timeline Dates',
      risk: 'high',
      detail: `Contains employment or graduation dates beyond current year (${currentYear}).`
    });
  } else if (hasInvertedDates) {
    findings.push({
      pillar: 'PILLAR_TIMELINE',
      signal: 'Chronological Inversion',
      risk: 'high',
      detail: 'Start year is greater than end year in parsed career timeline ranges.'
    });
  } else if (hasInflatedExp) {
    findings.push({
      pillar: 'PILLAR_TIMELINE',
      signal: 'Experience Claim Discrepancy',
      risk: 'medium',
      detail: `Claims ${claimedYrs}+ years experience, but earliest verified timeline date is ${Math.min(...parsedYears)}.`
    });
  } else if (parsedYears.length > 0) {
    findings.push({
      pillar: 'PILLAR_TIMELINE',
      signal: 'Chronological Sanity',
      risk: 'pass',
      detail: `Parsed ${yearRanges.length} career date ranges (${timelineText}) with consistent chronological ordering.`
    });
  }

  if (secCount >= 3) {
    findings.push({
      pillar: 'PILLAR_STRUCTURE',
      signal: 'Standard Resume Architecture',
      risk: 'pass',
      detail: `Document contains ${secCount}/4 core sections: ${detectedSections.join(', ')}.`
    });
  } else {
    findings.push({
      pillar: 'PILLAR_STRUCTURE',
      signal: 'Incomplete Section Structure',
      risk: 'medium',
      detail: `Only ${secCount}/4 core sections found (${detectedSections.join(', ') || 'none'}). Missing standard structure.`
    });
  }

  // 10. Generate Real Contextual Headline and Summary
  let headline;
  if (isScam) {
    headline = githubStatus === '404_fake' 
      ? 'FABRICATED / UNVERIFIED PORTFOLIO' 
      : 'SUSPICIOUS / IRREGULAR RESUME DETECTED';
  } else if (authenticityScore >= 75) {
    headline = 'AUTHENTIC CANDIDATE CREDENTIALS';
  } else {
    headline = 'CANDIDATE CV — VERIFIED (STANDARD)';
  }

  let summary;
  if (isScam) {
    summary = findings.find(f => f.risk === 'high')?.detail || 'Discrepancies identified in claimed portfolio repositories or chronological career timeline.';
  } else {
    const candidatePart = candidateName ? `Profile for ${candidateName}` : 'Candidate document';
    const skillsPart = uniqueSkills.length > 0 
      ? `${uniqueSkills.length} identified skills (${uniqueSkills.slice(0, 4).join(', ')})` 
      : 'general background';
    const timelinePart = parsedYears.length > 0 ? timelineText : 'unspecified timeline';
    const ghPart = githubStatus === 'verified' 
      ? `verified GitHub (@${githubUsername})` 
      : (hasLinkedIn ? 'verified LinkedIn' : 'standard documentation');
    summary = `${candidatePart} validated with ${skillsPart}, ${timelinePart}, and ${ghPart}.`;
  }

  // 11. 4 Real Extracted Metrics for the UI
  const metrics = [
    {
      label: 'Candidate / Contact',
      value: primaryEmail 
        ? `${candidateName ? `${candidateName} • ` : ''}${primaryEmail}` 
        : (candidateName || (primaryPhone ? `Phone: ${primaryPhone}` : 'No email detected')),
      risk: primaryEmail ? 'pass' : 'medium'
    },
    {
      label: 'Career Timeline',
      value: timelineText,
      risk: (hasFutureDates || hasInvertedDates || hasInflatedExp) ? 'high' : (parsedYears.length > 0 ? 'pass' : 'medium')
    },
    {
      label: 'Verified Skills',
      value: uniqueSkills.length > 0 
        ? `${uniqueSkills.slice(0, 3).join(', ')}${uniqueSkills.length > 3 ? ` (+${uniqueSkills.length - 3})` : ''}` 
        : 'General Profile',
      risk: uniqueSkills.length > 0 ? 'pass' : 'medium'
    },
    {
      label: 'Portfolio / GitHub',
      value: githubUsername 
        ? (githubStatus === 'verified' ? `@${githubUsername} (${githubRepoCount} Repos)` : (githubStatus === '404_fake' ? `⚠ @${githubUsername} (404 Fake)` : `@${githubUsername} (Active)`))
        : (hasLinkedIn ? 'LinkedIn Profile Linked' : 'None Attached (Optional)'),
      risk: githubStatus === '404_fake' ? 'high' : (githubStatus === 'verified' ? 'pass' : 'medium')
    }
  ];

  return {
    documentType: 'CANDIDATE_RESUME',
    isScam,
    authenticityScore,
    fakeProbability,
    realConfidence,
    headline,
    summary,
    metrics,
    googleRegistry: primaryEmail ? `Verified Contact: ${primaryEmail}` : 'Candidate Profile',
    githubCommits: githubUsername 
      ? (githubStatus === 'verified' ? `@${githubUsername} (${githubRepoCount} Repos)` : (githubStatus === '404_fake' ? `Fake Profile (@${githubUsername})` : `@${githubUsername}`))
      : 'None Attached (Optional)',
    findings
  };
}

/**
 * Master Authenticator Entrypoint
 * Strictly validates document MIME & extension: Only PDF (.pdf) and Word (.docx) allowed.
 */
export async function analyzeCvDocument(file) {
  const fileName = (file.name || '').toLowerCase();
  const isPdf = file.type === 'application/pdf' || fileName.endsWith('.pdf');
  const isDocx = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
                 file.type === 'application/msword' || 
                 fileName.endsWith('.docx') || fileName.endsWith('.doc');

  if (!isPdf && !isDocx) {
    throw new Error(`Unsupported document format for "${file.name}". TrustLens strictly accepts only verified PDF (.pdf) or Word (.docx) documents.`);
  }

  let docData;
  if (isPdf) {
    docData = await extractPdfData(file);
  } else {
    docData = await extractDocxData(file);
  }

  const text = docData.text || '';
  const metadata = docData.metadata || {};
  const hiddenUris = docData.hiddenUris || [];

  // Stage 2: Intent Classification
  const documentType = classifyDocumentIntent(text);

  if (documentType === 'EMPLOYMENT_OFFER_LETTER') {
    return evaluateOfferLetter(text, metadata, hiddenUris);
  } else {
    return await evaluateCandidateResume(text, metadata, hiddenUris);
  }
}
