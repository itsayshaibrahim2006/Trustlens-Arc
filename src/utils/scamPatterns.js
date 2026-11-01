// Comprehensive heuristic patterns for job scam, resume forgery, and malicious link detection

export const ADVANCE_FEE_PATTERNS = [
  /equipment\s+deposit/i,
  /cashier'?s?\s+check/i,
  /wire\s+transfer/i,
  /processing\s+fee/i,
  /starter\s+kit/i,
  /home\s+office\s+allowance\s+check/i,
  /check\s+deposit/i,
  /purchase\s+software\s+from\s+vendor/i,
  /reimbursement\s+check/i,
  /send\s+money\s+back/i,
  /overpayment/i,
  /western\s+union/i,
  /moneygram/i,
  /zelle/i,
  /venmo/i
];

export const UNSANCTIONED_COMM_PATTERNS = [
  /telegram(?:\.me|\.org|\s*:\s*|@)/i,
  /whatsapp(?:\.com|\s*:\s*|\+)/i,
  /signal(?:\.org|\s*:\s*)/i,
  /viber/i,
  /skype(?:\s*id|\s*:\s*)/i,
  /@(?:[a-zA-Z0-9_-]+careers|[a-zA-Z0-9_-]+recruiting|[a-zA-Z0-9_-]+hr)/i,
  /interview\s+(?:on|via)\s+(?:telegram|whatsapp|signal|hangouts)/i
];

export const FORGERY_PRODUCER_PATTERNS = [
  /canva/i,
  /piktochart/i,
  /visme/i,
  /venngage/i,
  /crello/i,
  /desygner/i,
  /snappa/i,
  /skia\/pdf/i
];

export const SUSPICIOUS_EMAIL_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'aol.com',
  'protonmail.com',
  'proton.me',
  'zoho.com',
  'mail.com',
  'yandex.com',
  'inbox.com'
];

export const TRUSTED_CORP_DOMAINS = [
  'google.com',
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
  'verification',
  'secure',
  'security',
  'account',
  'update',
  'confirm',
  'confirmation',
  'auth',
  'authenticate',
  'banking',
  'wallet',
  'recover',
  'password',
  'credential',
  'session',
  'portal',
  'resolution'
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
