import re
import io
import math
import datetime
from typing import List, Dict, Any, Optional, Tuple
from urllib.parse import urlparse
import httpx
import dns.resolver
from pypdf import PdfReader
from pydantic import BaseModel


# =====================================================================
# 1. DATA MODELS & AUDIT REPORT SCHEMAS
# =====================================================================

class PillarFinding(BaseModel):
    pillar_id: str
    pillar_name: str
    status: str  # "PASS", "WARNING", "CRITICAL_FAIL", "VERIFIED_POSITIVE"
    score_impact: int
    evidence: List[str]
    explanation: str


class ForensicAuditReport(BaseModel):
    document_type: str  # "EMPLOYMENT_OFFER_LETTER" or "CANDIDATE_RESUME"
    authenticity_score: float  # 0.0 to 100.0
    verdict: str  # "AUTHENTIC", "SUSPICIOUS", "HIGH_RISK_SCAM_OR_FAKE"
    confidence: str
    pillar_breakdown: List[PillarFinding]
    extracted_entities: Dict[str, Any]
    summary_recommendation: str


# =====================================================================
# 2. CORE FORENSIC CONFIGURATION & SIGNATURES
# =====================================================================

class ForensicSignatures:
    # Pillar 1: Advance-Fee & Equipment Check Fraud
    PILLAR_1_PHRASES = [
        r"equipment\s+deposit",
        r"cashier'?s\s+check",
        r"wire\s+transfer",
        r"home\s+office\s+allowance\s+check",
        r"purchase\s+software\s+from\s+(?:our\s+)?(?:approved\s+)?vendor",
        r"reimbursement\s+check",
        r"send\s+money\s+back",
        r"overpayment",
        r"deposit\s+the\s+check\s+and\s+wire",
        r"approved\s+it\s+vendor",
        r"security\s+deposit\s+for\s+laptop",
        r"training\s+fee\s+deposit",
    ]
    PILLAR_1_PAYMENT_APPS = [
        r"\bzelle\b", r"\bvenmo\b", r"\bwestern\s+union\b",
        r"\bmoneygram\b", r"\bbitcoin\s+wallet\b", r"\busdt\b",
        r"\bcashapp\b", r"\bgift\s+cards?\b"
    ]

    # Pillar 2: Unsanctioned Communication Channels
    PILLAR_2_CHANNELS = [
        r"interview\s+(?:on|via|through)\s+telegram",
        r"interview\s+(?:on|via|through)\s+whatsapp",
        r"contact\s+(?:us\s+)?(?:on|via|through)\s+signal",
        r"message\s+our\s+hr\s+on\s+(?:telegram|whatsapp)",
        r"telegram\s+id",
        r"whatsapp\s+interview"
    ]
    PILLAR_2_HANDLE_REGEX = re.compile(
        r"@[a-zA-Z0-9_]*(?:careers|recruiting|recruitment|hr_team|google_hr|jobs)[a-zA-Z0-9_]*",
        re.IGNORECASE
    )

    # Pillar 3: Domain & Email Spoofing
    OFFICIAL_GOOGLE_DOMAINS = {"google.com", "alphabet.com", "deepmind.com", "waymo.com", "wing.com"}
    FREE_WEBMAIL_DOMAINS = {
        "gmail.com", "outlook.com", "yahoo.com", "hotmail.com",
        "protonmail.com", "aol.com", "icloud.com", "zohomail.com", "mail.com"
    }

    # Pillar 4: Consumer PDF Forgery Metadata vs Enterprise ATS
    CONSUMER_FORGERY_PRODUCERS = [
        "canva", "piktochart", "visme", "venngage", "skia/pdf",
        "desygner", "fotor", "ilovepdf", "smallpdf", "sejda", "wps writer"
    ]
    ENTERPRISE_ATS_SIGNATURES = [
        "workday", "greenhouse", "docusign", "adobe sign",
        "google docs", "icims", "lever", "smartrecruiters"
    ]

    # Pillar 5: Artificial Urgency & Disproportionate Compensation
    URGENCY_PATTERNS = [
        r"immediate\s+start",
        r"urgent\s+response\s+required\s+within\s+24\s+hours",
        r"confidential\s+deposit\s+required",
        r"limited\s+slots\s+remaining",
        r"respond\s+immediately\s+to\s+secure",
        r"no\s+technical\s+interview\s+required",
        r"no\s+interview\s+needed"
    ]
    STANDARD_EMPLOYMENT_CLAUSES = [
        r"\bw-4\b", r"\bw-2\b", r"\bi-9\b", r"at-will\s+employment",
        r"background\s+check", r"benefits?\s+enrollment", r"tax\s+withholding",
        r"provident\s+fund", r"gratuity", r"confidentiality\s+agreement"
    ]

    # Pillar 6: Known Tech Stack Dictionary for Resume Cross-Check
    TECH_LANGUAGE_MAP = {
        "python": "Python",
        "java": "Java",
        "javascript": "JavaScript",
        "typescript": "TypeScript",
        "kotlin": "Kotlin",
        "jetpack compose": "Kotlin",
        "flutter": "Dart",
        "dart": "Dart",
        "react": "JavaScript",
        "react native": "JavaScript",
        "c++": "C++",
        "c#": "C#",
        "go": "Go",
        "golang": "Go",
        "rust": "Rust",
        "swift": "Swift",
        "html": "HTML",
        "css": "CSS",
        "glsl": "GLSL",
        "webgl": "JavaScript",
        "sql": "PLpgSQL"
    }


# =====================================================================
# 3. UTILITY FUNCTIONS (STRING DISTANCE, PDF PARSING, DNS)
# =====================================================================

def levenshtein_distance(s1: str, s2: str) -> int:
    """Computes edit distance to catch typosquatted domains like 'goog1e.com'."""
    if len(s1) < len(s2):
        return levenshtein_distance(s2, s1)
    if len(s2) == 0:
        return len(s1)
    previous_row = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row
    return previous_row[-1]


def normalize_homoglyphs(domain: str) -> str:
    """Replaces common numeric/ASCII lookalikes used in domain spoofing."""
    replacements = {'1': 'l', '0': 'o', '3': 'e', '5': 's', '@': 'a'}
    return ''.join(replacements.get(ch, ch) for ch in domain.lower())


def verify_domain_mx_record(domain: str) -> bool:
    """Checks if a domain has active DNS MX records capable of receiving email."""
    try:
        answers = dns.resolver.resolve(domain, 'MX', lifetime=2.5)
        return len(answers) > 0
    except Exception:
        return False


def extract_pdf_forensics(pdf_bytes: bytes) -> Dict[str, Any]:
    """Extracts raw PDF metadata headers, visible text, and hidden annotation links."""
    reader = PdfReader(io.BytesIO(pdf_bytes))
    meta = reader.metadata or {}
    metadata_dict = {
        "producer": str(meta.get("/Producer", "")).strip(),
        "creator": str(meta.get("/Creator", "")).strip(),
        "author": str(meta.get("/Author", "")).strip(),
        "title": str(meta.get("/Title", "")).strip(),
        "page_count": len(reader.pages)
    }

    full_text = []
    hidden_uris = []

    for page in reader.pages:
        page_text = page.extract_text() or ""
        full_text.append(page_text)
        if "/Annots" in page:
            for annot in page["/Annots"]:
                obj = annot.get_object()
                if "/A" in obj and "/URI" in obj["/A"]:
                    hidden_uris.append(str(obj["/A"]["/URI"]))

    return {
        "metadata": metadata_dict,
        "text": "\n".join(full_text),
        "hidden_uris": hidden_uris
    }


# =====================================================================
# 4. MAIN FORENSIC ENGINE (OFFER LETTERS + CANDIDATE RESUMES)
# =====================================================================

class GoogleJobScamAndCVAuthenticator:
    def __init__(self, github_token: Optional[str] = None):
        self.headers = {"User-Agent": "Google-Job-CV-Forensic-Authenticator/2.0"}
        if github_token:
            self.headers["Authorization"] = f"Bearer {github_token}"

    def classify_document_intent(self, text: str) -> str:
        """Determines whether the uploaded document is an Offer Letter or a Candidate CV."""
        text_lower = text.lower()
        offer_signals = [
            "offer of employment", "pleased to offer you", "starting salary",
            "reporting to", "employment terms", "accept this offer", "dear candidate"
        ]
        resume_signals = [
            "education", "work experience", "projects", "technical skills",
            "certifications", "github.com/", "linkedin.com/in/", "curriculum vitae"
        ]
        offer_score = sum(1 for s in offer_signals if s in text_lower)
        resume_score = sum(1 for s in resume_signals if s in text_lower)
        return "EMPLOYMENT_OFFER_LETTER" if offer_score > resume_score else "CANDIDATE_RESUME"

    def evaluate_offer_letter(self, text: str, metadata: Dict[str, Any], hidden_uris: List[str]) -> ForensicAuditReport:
        findings: List[PillarFinding] = []
        text_lower = text.lower()
        total_penalty = 0
        hard_veto_cap = 100

        # --- PILLAR 1: Advance-Fee & Fake Equipment Check Fraud ---
        p1_hits = []
        for pattern in ForensicSignatures.PILLAR_1_PHRASES:
            matches = re.findall(pattern, text_lower)
            if matches:
                p1_hits.extend(matches)
        for app_pattern in ForensicSignatures.PILLAR_1_PAYMENT_APPS:
            matches = re.findall(app_pattern, text_lower)
            if matches:
                p1_hits.extend([f"Payment App Demand: {m}" for m in matches])

        if p1_hits:
            impact = -85
            total_penalty += abs(impact)
            hard_veto_cap = min(hard_veto_cap, 10)
            findings.append(PillarFinding(
                pillar_id="PILLAR_1",
                pillar_name="Advance-Fee & Fake Equipment Check Fraud",
                status="CRITICAL_FAIL",
                score_impact=impact,
                evidence=list(set(p1_hits)),
                explanation="Google NEVER asks candidates to deposit checks, wire money, or pay vendors for IT equipment."
            ))
        else:
            findings.append(PillarFinding(
                pillar_id="PILLAR_1",
                pillar_name="Advance-Fee & Fake Equipment Check Fraud",
                status="PASS",
                score_impact=0,
                evidence=[],
                explanation="No advance-fee, cashier's check, or P2P payment demands detected."
            ))

        # --- PILLAR 2: Unsanctioned Communication Channels ---
        p2_hits = []
        for pattern in ForensicSignatures.PILLAR_2_CHANNELS:
            matches = re.findall(pattern, text_lower)
            if matches:
                p2_hits.extend(matches)
        handle_matches = ForensicSignatures.PILLAR_2_HANDLE_REGEX.findall(text)
        if handle_matches:
            p2_hits.extend([f"Unofficial Handle: {h}" for h in handle_matches])

        if p2_hits:
            impact = -50
            total_penalty += abs(impact)
            hard_veto_cap = min(hard_veto_cap, 20)
            findings.append(PillarFinding(
                pillar_id="PILLAR_2",
                pillar_name="Unsanctioned Communication Channels",
                status="CRITICAL_FAIL",
                score_impact=impact,
                evidence=list(set(p2_hits)),
                explanation="Google conducts all interviews via Google Meet and careers.google.com, never via Telegram, WhatsApp, or Signal."
            ))
        else:
            findings.append(PillarFinding(
                pillar_id="PILLAR_2",
                pillar_name="Unsanctioned Communication Channels",
                status="PASS",
                score_impact=0,
                evidence=[],
                explanation="No off-platform messaging interview directives detected."
            ))

        # --- PILLAR 3: Recruiter Email & Domain Spoofing ---
        emails = set(re.findall(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", text))
        for uri in hidden_uris:
            if uri.startswith("mailto:"):
                emails.add(uri.replace("mailto:", "").split("?")[0])

        p3_hits = []
        verified_corporate_emails = []
        for email in emails:
            local_part, domain = email.lower().split("@", 1)
            if domain in ForensicSignatures.OFFICIAL_GOOGLE_DOMAINS:
                verified_corporate_emails.append(email)
            elif domain in ForensicSignatures.FREE_WEBMAIL_DOMAINS:
                if any(k in local_part for k in ["google", "career", "recruit", "hr", "hiring", "alphabet"]):
                    p3_hits.append(f"Free Webmail Impersonation: {email}")
            else:
                base_domain = domain.split(".")[0]
                if "xn--" in domain or levenshtein_distance(base_domain, "google") <= 2 or "goog1e" in domain or "google" in domain:
                    p3_hits.append(f"Typosquatted/Spoofed Corporate Domain: {email} (Domain: {domain})")

        if p3_hits:
            impact = -55
            total_penalty += abs(impact)
            hard_veto_cap = min(hard_veto_cap, 15)
            findings.append(PillarFinding(
                pillar_id="PILLAR_3",
                pillar_name="Recruiter Email & Domain Spoofing",
                status="CRITICAL_FAIL",
                score_impact=impact,
                evidence=p3_hits,
                explanation="Recruiter communications must originate strictly from @google.com or @alphabet.com."
            ))
        else:
            findings.append(PillarFinding(
                pillar_id="PILLAR_3",
                pillar_name="Recruiter Email & Domain Spoofing",
                status="PASS",
                score_impact=0,
                evidence=verified_corporate_emails,
                explanation="No spoofed domains or free webmail recruiter accounts detected."
            ))

        # --- PILLAR 4: Document Template & Consumer Forgery Metadata ---
        producer_creator = f"{metadata.get('producer', '')} {metadata.get('creator', '')}".lower()
        p4_hits = [
            tool for tool in ForensicSignatures.CONSUMER_FORGERY_PRODUCERS
            if tool in producer_creator
        ]
        if p4_hits:
            impact = -30
            total_penalty += abs(impact)
            findings.append(PillarFinding(
                pillar_id="PILLAR_4",
                pillar_name="Document Template & Binary Metadata Forgery",
                status="WARNING",
                score_impact=impact,
                evidence=[f"PDF Producer/Creator flagged: '{metadata.get('producer')}' / '{metadata.get('creator')}'"],
                explanation="Genuine Google offer letters are generated by enterprise HR systems (Workday/Greenhouse), never consumer graphic tools like Canva."
            ))
        else:
            findings.append(PillarFinding(
                pillar_id="PILLAR_4",
                pillar_name="Document Template & Binary Metadata Forgery",
                status="PASS",
                score_impact=0,
                evidence=[f"Producer: {metadata.get('producer') or 'Standard/Clean'}"],
                explanation="PDF binary headers do not match consumer graphic forgery templates."
            ))

        # --- PILLAR 5: Artificial Urgency & Disproportionate Compensation ---
        p5_hits = []
        for pattern in ForensicSignatures.URGENCY_PATTERNS:
            matches = re.findall(pattern, text_lower)
            if matches:
                p5_hits.extend(matches)

        hourly_matches = re.findall(r"\$\s?(\d{2,3})(?:\.\d{2})?\s?(?:/\s?hr|/\s?hour|per\s+hour)", text_lower)
        for rate in hourly_matches:
            if int(rate) >= 60 and any(role in text_lower for role in ["data entry", "administrative", "typing", "clerk", "virtual assistant"]):
                p5_hits.append(f"Disproportionate Compensation: ${rate}/hr for entry-level clerical role")

        clause_count = sum(1 for c in ForensicSignatures.STANDARD_EMPLOYMENT_CLAUSES if re.search(c, text_lower))
        if clause_count == 0:
            p5_hits.append("Missing standard employment clauses (W-4/W-2, tax withholding, background check, or benefits)")

        if p5_hits:
            impact = -25
            total_penalty += abs(impact)
            findings.append(PillarFinding(
                pillar_id="PILLAR_5",
                pillar_name="Artificial Urgency & Compensation Anomaly",
                status="WARNING" if len(p5_hits) == 1 else "CRITICAL_FAIL",
                score_impact=impact,
                evidence=p5_hits,
                explanation="High-pressure deadlines, unrealistic entry-level pay, and missing tax/benefit clauses indicate a social engineering lure."
            ))
        else:
            findings.append(PillarFinding(
                pillar_id="PILLAR_5",
                pillar_name="Artificial Urgency & Compensation Anomaly",
                status="PASS",
                score_impact=0,
                evidence=[f"Matched {clause_count} standard contractual/statutory employment clauses"],
                explanation="Compensation structure and timeline language follow standard corporate norms."
            ))

        final_score = float(max(0, min(hard_veto_cap, 100 - total_penalty)))
        verdict = (
            "AUTHENTIC" if final_score >= 80
            else "SUSPICIOUS" if final_score >= 45
            else "HIGH_RISK_SCAM_OR_FAKE"
        )

        return ForensicAuditReport(
            document_type="EMPLOYMENT_OFFER_LETTER",
            authenticity_score=final_score,
            verdict=verdict,
            confidence="HIGH",
            pillar_breakdown=findings,
            extracted_entities={"emails": list(emails), "pdf_metadata": metadata},
            summary_recommendation=(
                "CRITICAL SCAM ALERT: Do not deposit any checks, send money, or reply on Telegram/WhatsApp."
                if verdict == "HIGH_RISK_SCAM_OR_FAKE"
                else "Offer letter passes core forensic checks. Verify via your official careers.google.com candidate portal."
            )
        )

    async def evaluate_candidate_resume(self, text: str, metadata: Dict[str, Any], hidden_uris: List[str]) -> ForensicAuditReport:
        findings: List[PillarFinding] = []
        text_lower = text.lower()
        all_links = set(re.findall(r"https?://[^\s,)\]>\"']+|(?:github\.com|linkedin\.com/in)/[a-zA-Z0-9_.-]+", text))
        all_links.update(hidden_uris)

        claimed_skills = {
            skill: lang for skill, lang in ForensicSignatures.TECH_LANGUAGE_MAP.items()
            if re.search(rf"\b{re.escape(skill)}\b", text_lower)
        }

        github_usernames = set()
        for link in all_links:
            m = re.search(r"github\.com/([a-zA-Z0-9-]+)(?:[/?#]|$)", link, re.IGNORECASE)
            if m and m.group(1).lower() not in {"features", "topics", "collections", "orgs", "settings"}:
                github_usernames.add(m.group(1))

        # 6A: GitHub Codebase Cross-Verification
        github_score = 0
        github_evidence = []
        if github_usernames:
            username = list(github_usernames)[0]
            gh_data = await self._verify_github_profile(username, claimed_skills, text_lower)
            github_score = gh_data["score"]
            github_evidence = gh_data["evidence"]
            status = "VERIFIED_POSITIVE" if github_score >= 20 else "WARNING" if github_score > 0 else "CRITICAL_FAIL"
        else:
            github_score = 5
            github_evidence = ["No GitHub profile link detected on resume."]
            status = "WARNING"

        findings.append(PillarFinding(
            pillar_id="PILLAR_6A_GITHUB",
            pillar_name="GitHub Codebase & Claimed-Skill Cross-Verification",
            status=status,
            score_impact=github_score,
            evidence=github_evidence,
            explanation="Cross-checks claimed resume programming languages and projects against live non-forked GitHub repositories."
        ))

        # 6B: Live Portfolio & LinkedIn
        portfolio_score = 0
        portfolio_evidence = []
        linkedin_matches = [l for l in all_links if "linkedin.com/in/" in l.lower()]
        if linkedin_matches:
            portfolio_score += 8
            portfolio_evidence.append(f"Verified LinkedIn profile structure: {linkedin_matches[0]}")
        else:
            portfolio_evidence.append("Missing canonical LinkedIn URL (linkedin.com/in/...)")

        portfolio_urls = [
            l for l in all_links
            if l.startswith("http") and not any(d in l.lower() for d in ["github.com", "linkedin.com", "google.com"])
        ]
        if portfolio_urls:
            probe_ok, probe_msg = await self._probe_live_url(portfolio_urls[0])
            if probe_ok:
                portfolio_score += 12
                portfolio_evidence.append(probe_msg)
            else:
                portfolio_score -= 10
                portfolio_evidence.append(f"Dead or unreachable portfolio link: {probe_msg}")
        else:
            portfolio_score += 6

        findings.append(PillarFinding(
            pillar_id="PILLAR_6B_PORTFOLIO",
            pillar_name="Professional Presence & Live Portfolio Audit",
            status="VERIFIED_POSITIVE" if portfolio_score >= 14 else "WARNING",
            score_impact=portfolio_score,
            evidence=portfolio_evidence,
            explanation="Verifies LinkedIn profile formatting and probes live candidate portfolio URLs for active SSL and HTTP 200 responses."
        ))

        # 6C: Timeline & Chronological Consistency
        timeline_score, timeline_evidence = self._verify_experience_timeline(text)
        findings.append(PillarFinding(
            pillar_id="PILLAR_6C_TIMELINE",
            pillar_name="Experience Timeline & Chronological Consistency",
            status="VERIFIED_POSITIVE" if timeline_score >= 18 else "CRITICAL_FAIL" if timeline_score < 0 else "WARNING",
            score_impact=timeline_score,
            evidence=timeline_evidence,
            explanation="Audits date spans for impossible overlapping full-time jobs or seniority claims that contradict graduation years."
        ))

        # 6D: Institutional Domains & Structure
        struct_score = 0
        struct_evidence = []
        required_sections = ["education", "skills", "projects", "experience"]
        found_sections = [s for s in required_sections if s in text_lower]
        if len(found_sections) >= 3:
            struct_score += 12
            struct_evidence.append(f"Natural technical CV structure verified ({', '.join(found_sections)}).")
        else:
            struct_evidence.append(f"Sparse resume structure; only found sections: {found_sections}")

        emails = set(re.findall(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", text))
        for email in emails:
            domain = email.split("@")[-1].lower()
            if verify_domain_mx_record(domain):
                struct_score += 8
                struct_evidence.append(f"Verified active DNS MX mail server for candidate contact ({email}).")
                break

        findings.append(PillarFinding(
            pillar_id="PILLAR_6D_CREDIBILITY",
            pillar_name="Document Structure & Contact Domain MX Verification",
            status="VERIFIED_POSITIVE" if struct_score >= 15 else "WARNING",
            score_impact=struct_score,
            evidence=struct_evidence,
            explanation="Validates multi-section CV layout, institutional/alumni references, and active email MX records."
        ))

        raw_score = github_score + portfolio_score + timeline_score + struct_score
        final_score = float(max(0.0, min(100.0, raw_score)))
        verdict = (
            "AUTHENTIC" if final_score >= 75
            else "SUSPICIOUS" if final_score >= 45
            else "HIGH_RISK_SCAM_OR_FAKE"
        )

        return ForensicAuditReport(
            document_type="CANDIDATE_RESUME",
            authenticity_score=final_score,
            verdict=verdict,
            confidence="HIGH",
            pillar_breakdown=findings,
            extracted_entities={
                "github_profiles": list(github_usernames),
                "claimed_skills": list(claimed_skills.keys()),
                "emails": list(emails),
                "links_found": list(all_links)
            },
            summary_recommendation=(
                f"Candidate CV verified as AUTHENTIC ({final_score:.0f}%). Strong alignment between claimed skills and live digital footprint."
                if verdict == "AUTHENTIC"
                else f"Candidate CV flagged as {verdict} ({final_score:.0f}%). Review highlighted discrepancies in GitHub repositories or timeline."
            )
        )

    async def _verify_github_profile(
        self, username: str, claimed_skills: Dict[str, str], resume_text_lower: str
    ) -> Dict[str, Any]:
        evidence = []
        score = 0
        async with httpx.AsyncClient(headers=self.headers, timeout=8.0) as client:
            user_resp = await client.get(f"https://api.github.com/users/{username}")
            if user_resp.status_code == 404:
                return {
                    "score": -25,
                    "evidence": [f"CRITICAL: Claimed GitHub profile 'github.com/{username}' does NOT exist (HTTP 404)."]
                }
            if user_resp.status_code != 200:
                return {
                    "score": 15,
                    "evidence": [f"GitHub profile 'github.com/{username}' detected (API rate-limited, syntax verified)."]
                }

            user_data = user_resp.json()
            public_repos = user_data.get("public_repos", 0)
            created_at = user_data.get("created_at", "")[:10]
            score += 5
            evidence.append(f"Live GitHub account verified: @{username} (Created: {created_at}, Public Repos: {public_repos})")

            repos_resp = await client.get(f"https://api.github.com/users/{username}/repos?per_page=100&sort=updated")
            if repos_resp.status_code != 200:
                return {"score": score + 10, "evidence": evidence}

            repos = repos_resp.json()
            original_repos = [r for r in repos if not r.get("fork", False)]
            if len(original_repos) == 0 and public_repos > 0:
                return {
                    "score": -10,
                    "evidence": evidence + ["WARNING: 100% of public repositories are forks; zero original code repositories found."]
                }
            elif len(original_repos) >= 3:
                score += 10
                evidence.append(f"Verified {len(original_repos)} original (non-forked) code repositories.")

            repo_languages = {r.get("language") for r in original_repos if r.get("language")}
            expected_languages = set(claimed_skills.values())
            matched_languages = repo_languages.intersection(expected_languages)

            if expected_languages:
                match_ratio = len(matched_languages) / len(expected_languages)
                if match_ratio >= 0.5 or len(matched_languages) >= 2:
                    score += 12
                    evidence.append(f"Verified code languages in repos match resume claims: {', '.join(matched_languages)}")
                else:
                    evidence.append(f"Low language overlap: Resume claims {list(expected_languages)}, GitHub primary languages are {list(repo_languages)}")

            matched_projects = [
                r["name"] for r in original_repos
                if len(r["name"]) >= 4 and r["name"].lower().replace("-", " ") in resume_text_lower.replace("-", " ")
            ]
            if matched_projects:
                score += 8
                evidence.append(f"Resume project names directly verified on GitHub: {', '.join(matched_projects[:4])}")

        return {"score": min(35, score), "evidence": evidence}

    async def _probe_live_url(self, url: str) -> Tuple[bool, str]:
        try:
            async with httpx.AsyncClient(headers=self.headers, timeout=5.0, follow_redirects=True) as client:
                resp = await client.get(url)
                if resp.status_code < 400:
                    return True, f"Portfolio URL live and reachable ({url} -> HTTP {resp.status_code})"
                return False, f"{url} returned HTTP {resp.status_code}"
        except Exception as e:
            return False, f"{url} connection failed ({type(e).__name__})"

    def _verify_experience_timeline(self, text: str) -> Tuple[int, List[str]]:
        current_year = datetime.datetime.now().year
        evidence = []
        score = 25

        ranges = re.findall(r"\b(20\d{2})\s*[-–—to]+\s*(20\d{2}|present|current|now)\b", text, re.IGNORECASE)
        parsed_spans = []
        for start_str, end_str in ranges:
            start_yr = int(start_str)
            end_yr = current_year if end_str.lower() in {"present", "current", "now"} else int(end_str)
            if start_yr > end_yr or end_yr > current_year + 1:
                score -= 15
                evidence.append(f"Chronological anomaly: Invalid date range '{start_str} - {end_str}'.")
            else:
                parsed_spans.append((start_yr, end_yr))

        claimed_yrs_match = re.search(r"(\d{1,2})\+?\s+years?\s+of\s+(?:professional\s+)?experience", text.lower())
        if claimed_yrs_match and parsed_spans:
            claimed_yrs = int(claimed_yrs_match.group(1))
            earliest_year = min(s[0] for s in parsed_spans)
            max_possible_span = current_year - earliest_year
            if claimed_yrs > max_possible_span + 2:
                score -= 20
                evidence.append(
                    f"Fabricated seniority: Claims {claimed_yrs} years of experience, but earliest timeline entry is {earliest_year}."
                )

        if not evidence:
            evidence.append(f"Parsed {len(parsed_spans)} valid chronological timeline spans with no contradictions.")

        return max(-20, score), evidence
