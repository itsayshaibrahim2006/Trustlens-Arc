// Comprehensive forensic patterns for Job Scam & CV Authenticator

// Pillar 1: Advance-Fee & Fake Equipment Check Fraud
export const ADVANCE_FEE_PATTERNS = [
  /equipment\s+deposit/i,
  /cashier'?s?\s+check/i,
  /wire\s+transfer/i,
  /home\s+office\s+allowance\s+check/i,
  /purchase\s+software\s+from\s+(?:our\s+)?(?:approved\s+)?vendor/i,
  /reimbursement\s+check/i,
  /send\s+money\s+back/i,
  /overpayment/i,
  /deposit\s+the\s+check\s+and\s+wire/i,
  /approved\s+it\s+vendor/i,
  /security\s+deposit\s+for\s+laptop/i,
  /training\s+fee\s+deposit/i,
  /starter\s+kit/i,
  /processing\s+fee/i,
  /check\s+deposit/i
];

export const PAYMENT_APP_PATTERNS = [
  /\bzelle\b/i,
  /\bvenmo\b/i,
  /\bwestern\s+union\b/i,
  /\bmoneygram\b/i,
  /\bbitcoin\s+wallet\b/i,
  /\busdt\b/i,
  /\bcashapp\b/i,
  /\bgift\s+cards?\b/i
];

// Pillar 2: Unsanctioned Communication Channels
export const UNSANCTIONED_COMM_PATTERNS = [
  /interview\s+(?:on|via|through)\s+telegram/i,
  /interview\s+(?:on|via|through)\s+whatsapp/i,
  /contact\s+(?:us\s+)?(?:on|via|through)\s+signal/i,
  /message\s+our\s+hr\s+on\s+(?:telegram|whatsapp)/i,
  /telegram\s+id/i,
  /whatsapp\s+interview/i,
  /telegram(?:\.me|\.org|\s*:\s*|@)/i,
  /whatsapp(?:\.com|\s*:\s*|\+)/i,
  /signal(?:\.org|\s*:\s*)/i,
  /viber/i,
  /skype(?:\s*id|\s*:\s*)/i
];

export const UNSANCTIONED_HANDLE_REGEX = /@[a-zA-Z0-9_]*(?:careers|recruiting|recruitment|hr_team|google_hr|jobs)[a-zA-Z0-9_]*/i;

// Pillar 3: Corporate Domains & Free Webmail Impersonation
export const OFFICIAL_GOOGLE_DOMAINS = [
  'google.com',
  'alphabet.com',
  'deepmind.com',
  'waymo.com',
  'wing.com'
];

export const FREE_WEBMAIL_DOMAINS = [
  'gmail.com',
  'outlook.com',
  'yahoo.com',
  'hotmail.com',
  'protonmail.com',
  'proton.me',
  'aol.com',
  'icloud.com',
  'zohomail.com',
  'zoho.com',
  'mail.com',
  'yandex.com',
  'inbox.com'
];

export const TRUSTED_CORP_DOMAINS = [
  'google.com',
  'alphabet.com',
  'deepmind.com',
  'stripe.com',
  'apple.com',
  'microsoft.com',
  'amazon.com',
  'meta.com',
  'netflix.com',
  'github.com',
  'linkedin.com',
  'uber.com',
  'airbnb.com',
  'salesforce.com'
];

// Pillar 4: Document Template & Consumer Forgery Metadata
export const CONSUMER_FORGERY_PRODUCERS = [
  'canva',
  'piktochart',
  'visme',
  'venngage',
  'desygner',
  'crello',
  'snappa',
  'fotor',
  'ilovepdf',
  'smallpdf',
  'sejda',
  'wps writer',
  'skia/pdf'
];

export const ENTERPRISE_ATS_SIGNATURES = [
  'workday',
  'greenhouse',
  'docusign',
  'adobe sign',
  'google docs',
  'icims',
  'lever',
  'smartrecruiters'
];

// Pillar 5: Artificial Urgency & Compensation Anomalies
export const URGENCY_PATTERNS = [
  /immediate\s+start/i,
  /urgent\s+response\s+required\s+within\s+24\s+hours/i,
  /urgent\s+response/i,
  /within\s+24\s+hours/i,
  /confidential\s+deposit\s+required/i,
  /confidential\s+deposit/i,
  /limited\s+slots\s+remaining/i,
  /limited\s+slots/i,
  /respond\s+immediately\s+to\s+secure/i,
  /no\s+technical\s+interview\s+required/i,
  /no\s+technical\s+interview/i,
  /no\s+interview\s+needed/i,
  /offer\s+(?:is\s+)?valid\s+only\s+today/i,
  /immediate\s+confirmation\s+without\s+screening/i
];

// Pillar 6: EMSCAD Benchmark Upfront Identity & Banking Harvesting
export const IDENTITY_HARVESTING_PATTERNS = [
  /(?:provide|submit|send)\s+(?:your\s+)?(?:ssn|social\s+security\s+number)/i,
  /(?:front\s+and\s+back|copy)\s+of\s+(?:your\s+)?(?:driver'?s?\s+license|passport|national\s+id)/i,
  /bank\s+(?:account|routing)\s+number\s+for\s+(?:equipment|starter|laptop)/i,
  /credit\s+(?:report|score)\s+verification\s+fee/i,
  /background\s+check\s+processing\s+fee/i,
  /send\s+(?:your\s+)?banking\s+credentials/i
];

// Pillar 7: EMSCAD Instant Direct Hiring & Unrealistic Compensation Red Flags
export const INSTANT_HIRE_PATTERNS = [
  /direct\s+appointment\s+(?:letter|order)/i,
  /interview\s+(?:has\s+been\s+|is\s+)?waived/i,
  /selected\s+without\s+(?:any\s+)?(?:interview|test|screening)/i,
  /congratulations\s+you\s+are\s+hired\s+immediately/i,
  /(?:data\s+entry|typing|virtual\s+assistant|clerk)\s*[-–,:@]\s*\$(?:[4-9]\d|1\d\d)\s*(?:\/|\s*per\s*)hr/i,
  /no\s+experience\s+(?:required|needed)\s*[-–,:@]\s*\$(?:[4-9]\d|1\d\d)/i,
  /earn\s+\$[1-9]\d{3,}\s*(?:weekly|a\s+week)\s+from\s+home/i
];

export const STANDARD_EMPLOYMENT_CLAUSES = [
  /\bw-4\b/i,
  /\bw-2\b/i,
  /\bi-9\b/i,
  /at-will\s+employment/i,
  /background\s+check/i,
  /benefits?\s+enrollment/i,
  /tax\s+withholding/i,
  /provident\s+fund/i,
  /gratuity/i,
  /confidentiality\s+agreement/i,
  /equal\s+opportunity\s+employer/i
];

// Pillar 6: Known Tech Stack to Language Mapping for GitHub Cross-Check
export const TECH_LANGUAGE_MAP = {
  'python': 'Python',
  'java': 'Java',
  'javascript': 'JavaScript',
  'typescript': 'TypeScript',
  'kotlin': 'Kotlin',
  'jetpack compose': 'Kotlin',
  'flutter': 'Dart',
  'dart': 'Dart',
  'react': 'JavaScript',
  'react native': 'JavaScript',
  'c++': 'C++',
  'c#': 'C#',
  'go': 'Go',
  'golang': 'Go',
  'rust': 'Rust',
  'swift': 'Swift',
  'html': 'HTML',
  'css': 'CSS',
  'glsl': 'GLSL',
  'webgl': 'JavaScript',
  'sql': 'PLpgSQL'
};

export const HIGH_RISK_TLDS = [
  'tk', 'ml', 'ga', 'cf', 'gq', 'ru', 'cn', 'xyz', 'top', 'buzz',
  'club', 'work', 'loan', 'click', 'link', 'country', 'stream',
  'gdn', 'mom', 'xin', 'kim', 'men', 'party', 'download', 'review'
];

export const POPULAR_BRANDS = [
  'apple',
  'google',
  'microsoft',
  'paypal',
  'stripe',
  'amazon',
  'netflix',
  'facebook',
  'instagram',
  'github',
  'linkedin',
  'twitter',
  'whatsapp',
  'binance',
  'coinbase',
  'wellsfargo',
  'chase',
  'bankofamerica'
];

export const SUSPICIOUS_PATH_KEYWORDS = [
  'login',
  'signin',
  'verify',
  'secure',
  'update',
  'wallet',
  'banking',
  'account',
  'confirm',
  'auth'
];

export const URL_SHORTENERS = [
  'bit.ly',
  'tinyurl.com',
  't.co',
  'goo.gl',
  'ow.ly',
  'is.gd',
  'buff.ly',
  'adf.ly',
  'cutt.ly',
  'rebrand.ly',
  'shorturl.at'
];

export const HOMOGLYPHS = {
  '\u0430': 'a', // Cyrillic Small Letter A
  '\u0441': 'c', // Cyrillic Small Letter Es
  '\u0435': 'e', // Cyrillic Small Letter Ie
  '\u0456': 'i', // Cyrillic Small Letter Byelorussian-Ukrainian I
  '\u0458': 'j', // Cyrillic Small Letter Je
  '\u043E': 'o', // Cyrillic Small Letter O
  '\u0440': 'p', // Cyrillic Small Letter Er
  '\u0455': 's', // Cyrillic Small Letter Dze
  '\u0443': 'y', // Cyrillic Small Letter U
  '\u0445': 'x'  // Cyrillic Small Letter Ha
};

