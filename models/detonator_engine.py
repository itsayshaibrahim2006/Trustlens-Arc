import re
import io
import ssl
import socket
import base64
import urllib.parse
import ipaddress
from typing import List, Dict, Any, Optional, Tuple
from urllib.parse import urlparse, parse_qs
import cv2
import numpy as np
from pydantic import BaseModel
from playwright.async_api import async_playwright, Download, Request, Response


# =====================================================================
# 1. DATA SCHEMAS & REPORT MODELS
# =====================================================================

class ThreatFinding(BaseModel):
    category: str
    severity: str  # "INFO", "LOW", "MEDIUM", "HIGH", "CRITICAL"
    risk_points: int
    description: str
    evidence: str


class DetonationReport(BaseModel):
    input_type: str  # "QR_IMAGE" or "RAW_URL"
    raw_payload: str
    payload_scheme: str  # "https", "http", "upi", "wifi", "data", etc.
    final_url: Optional[str] = None
    redirect_chain: List[str] = []
    risk_score: int  # 0 (Completely Safe) to 100 (Confirmed Malicious)
    safety_score: int  # 100 (Completely Safe) to 0 (Confirmed Malicious)
    verdict: str  # "SAFE", "SUSPICIOUS", "MALICIOUS"
    findings: List[ThreatFinding] = []
    dom_telemetry: Dict[str, Any] = {}
    tls_info: Dict[str, Any] = {}
    screenshot_base64: Optional[str] = None
    summary: str


# =====================================================================
# 2. THREAT INTELLIGENCE SIGNATURES & BRAND TARGETS
# =====================================================================

class ThreatSignatures:
    URL_SHORTENERS = {
        "bit.ly", "tinyurl.com", "t.co", "goo.gl", "ow.ly", "is.gd",
        "buff.ly", "rebrand.ly", "cutt.ly", "qrco.de", "qr-code.io",
        "rb.gy", "shorturl.at", "tiny.cc", "v.gd"
    }
    HIGH_RISK_TLDS = {
        ".top", ".xyz", ".buzz", ".icu", ".tk", ".ml", ".ga", ".cf",
        ".gq", ".cn", ".ru", ".work", ".click", ".loan", ".zip", ".mov"
    }
    SUSPICIOUS_URL_KEYWORDS = [
        "login", "verify", "kyc", "update-account", "secure-auth", "banking",
        "password-reset", "wallet-connect", "airdrop", "claim-reward", "free-gift",
        "refund", "blocked", "suspended"
    ]
    DANGEROUS_EXTENSIONS = (
        ".apk", ".exe", ".msi", ".scr", ".bat", ".cmd", ".ps1", ".vbs",
        ".jar", ".iso", ".dmg", ".crx"
    )
    PROTECTED_BRANDS = {
        "google": {"google.com", "accounts.google.com", "workspace.google.com"},
        "microsoft": {"microsoft.com", "live.com", "office.com", "microsoftonline.com"},
        "apple": {"apple.com", "icloud.com"},
        "paypal": {"paypal.com"},
        "amazon": {"amazon.com", "amazon.in", "aws.amazon.com"},
        "hdfc": {"hdfcbank.com", "netbanking.hdfcbank.com"},
        "sbi": {"onlinesbi.sbi", "sbi.co.in"},
        "icici": {"icicibank.com"},
        "netflix": {"netflix.com"},
        "instagram": {"instagram.com"},
        "whatsapp": {"whatsapp.com"},
        "linkedin": {"linkedin.com"},
        "github": {"github.com"}
    }


# =====================================================================
# 3. MULTI-PASS QR CODE VISION DECODER
# =====================================================================

class QRCodeVisionDecoder:
    """
    Decodes QR codes from uploaded images using multi-pass OpenCV preprocessing
    (grayscale, CLAHE contrast enhancement, adaptive thresholding, color inversion)
    to handle low-light, stylized, or screen-photographed QR codes.
    """
    def __init__(self):
        self.detector = cv2.QRCodeDetector()

    def decode_image_bytes(self, image_bytes: bytes) -> Tuple[List[str], Dict[str, Any]]:
        np_arr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        if img is None:
            raise ValueError("Invalid or corrupted image file.")

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        clahe = cv2.createCLAHE(clipLimit=2.5, tileGridSize=(8, 8)).apply(gray)
        inverted = cv2.bitwise_not(gray)
        thresh = cv2.adaptiveThreshold(
            clahe, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 21, 5
        )

        decoded_payloads = []
        for candidate in [img, gray, clahe, inverted, thresh]:
            try:
                retval, decoded_info, points, _ = self.detector.detectAndDecodeMulti(candidate)
                if retval and decoded_info:
                    valid = [d.strip() for d in decoded_info if d and d.strip()]
                    if valid:
                        decoded_payloads = valid
                        break
            except Exception:
                pass

            try:
                data, points, _ = self.detector.detectAndDecode(candidate)
                if data and data.strip():
                    decoded_payloads = [data.strip()]
                    break
            except Exception:
                pass

        meta = {
            "image_dimensions": f"{img.shape[1]}x{img.shape[0]}",
            "qr_count_detected": len(decoded_payloads)
        }
        return decoded_payloads, meta


# =====================================================================
# 4. SSRF GUARD, LEXICAL & TLS INSPECTOR
# =====================================================================

def is_safe_public_host(hostname: str) -> Tuple[bool, str]:
    """SSRF Protection: Resolves hostname and blocks loopback, private LAN, link-local, and reserved IP ranges."""
    if not hostname:
        return False, "Missing hostname"
    try:
        addr_info = socket.getaddrinfo(hostname, None)
        for item in addr_info:
            ip_str = item[4][0]
            ip_obj = ipaddress.ip_address(ip_str)
            if (
                ip_obj.is_private or ip_obj.is_loopback or ip_obj.is_link_local or
                ip_obj.is_multicast or ip_obj.is_reserved
            ):
                return False, f"Blocked internal/private IP resolution ({ip_str})"
        return True, addr_info[0][4][0]
    except socket.gaierror:
        return False, f"DNS resolution failed (NXDOMAIN) for '{hostname}'"


def inspect_tls_certificate(hostname: str, port: int = 443) -> Dict[str, Any]:
    """Connects via TLS to inspect certificate issuer, subject, and validity."""
    context = ssl.create_default_context()
    try:
        with socket.create_connection((hostname, port), timeout=4.0) as sock:
            with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                cert = ssock.getpeercert()
                issuer = dict(x[0] for x in cert.get("issuer", []))
                subject = dict(x[0] for x in cert.get("subject", []))
                return {
                    "valid_tls": True,
                    "issuer_org": issuer.get("organizationName", "Unknown"),
                    "common_name": subject.get("commonName", hostname),
                    "not_after": cert.get("notAfter", "")
                }
    except Exception as e:
        return {"valid_tls": False, "error": str(e)}


def levenshtein_distance(s1: str, s2: str) -> int:
    if len(s1) < len(s2):
        return levenshtein_distance(s2, s1)
    if len(s2) == 0:
        return len(s1)
    previous_row = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            current_row.append(min(
                previous_row[j + 1] + 1,
                current_row[j] + 1,
                previous_row[j] + (c1 != c2)
            ))
        previous_row = current_row
    return previous_row[-1]


# =====================================================================
# 5. CORE QR & FAKE LINK DETONATOR ENGINE
# =====================================================================

class QRAndLinkDetonator:
    def __init__(self):
        self.qr_decoder = QRCodeVisionDecoder()

    async def detonate_qr_image(self, image_bytes: bytes) -> DetonationReport:
        payloads, qr_meta = self.qr_decoder.decode_image_bytes(image_bytes)
        if not payloads:
            return DetonationReport(
                input_type="QR_IMAGE",
                raw_payload="",
                payload_scheme="none",
                risk_score=0,
                safety_score=100,
                verdict="SUSPICIOUS",
                findings=[ThreatFinding(
                    category="QR_DECODE_FAILURE",
                    severity="MEDIUM",
                    risk_points=25,
                    description="No readable QR code payload found in the uploaded image.",
                    evidence=str(qr_meta)
                )],
                summary="Could not decode a valid QR code from the image."
            )

        primary_payload = payloads[0]
        report = await self.detonate_payload(primary_payload, input_type="QR_IMAGE")

        if len(payloads) > 1:
            report.findings.append(ThreatFinding(
                category="DUAL_QR_TAMPERING",
                severity="HIGH",
                risk_points=35,
                description="Multiple distinct QR codes detected in the same image (physical sticker overlay tampering).",
                evidence=f"Detected {len(payloads)} payloads: {payloads}"
            ))
            report = self._recalculate_verdict(report)

        return report

    async def detonate_payload(self, raw_payload: str, input_type: str = "RAW_URL") -> DetonationReport:
        payload = raw_payload.strip()
        parsed = urlparse(payload)
        scheme = (parsed.scheme or "").lower()

        if not scheme and re.match(r"^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(/.*)?$", payload):
            payload = "https://" + payload
            parsed = urlparse(payload)
            scheme = "https"

        if scheme not in {"http", "https"}:
            return self._analyze_non_http_payload(payload, scheme, input_type)

        findings: List[ThreatFinding] = []
        hostname = (parsed.hostname or "").lower()

        # Stage 3A: Lexical & Domain Heuristics
        findings.extend(self._analyze_url_lexical(payload, hostname, stage="Initial URL"))

        # Stage 3B: SSRF Protection
        is_safe_ip, ip_or_err = is_safe_public_host(hostname)
        if not is_safe_ip:
            findings.append(ThreatFinding(
                category="NETWORK_OR_SSRF_BLOCK",
                severity="CRITICAL",
                risk_points=85,
                description="URL points to an unresolvable domain or blocked internal/private network address.",
                evidence=ip_or_err
            ))
            report = DetonationReport(
                input_type=input_type,
                raw_payload=raw_payload,
                payload_scheme=scheme,
                final_url=payload,
                redirect_chain=[payload],
                risk_score=0,
                safety_score=100,
                verdict="MALICIOUS",
                findings=findings,
                summary=f"Blocked unsafe or non-existent host: {ip_or_err}"
            )
            return self._recalculate_verdict(report)

        # Stage 4: Playwright Sandbox Detonation
        sandbox_data = await self._run_playwright_sandbox(payload)
        final_url = sandbox_data["final_url"]
        redirect_chain = sandbox_data["redirect_chain"]
        final_hostname = (urlparse(final_url).hostname or "").lower()

        if final_hostname and final_hostname != hostname:
            findings.extend(self._analyze_url_lexical(final_url, final_hostname, stage="Final Destination URL"))

        if len(redirect_chain) >= 3:
            findings.append(ThreatFinding(
                category="MULTI_HOP_REDIRECT_CLOAKING",
                severity="MEDIUM",
                risk_points=20,
                description=f"URL hopped through {len(redirect_chain)} redirects to mask destination.",
                evidence=" -> ".join(redirect_chain)
            ))

        tls_info = {}
        if final_url.startswith("https://") and final_hostname:
            tls_info = inspect_tls_certificate(final_hostname)
            if not tls_info.get("valid_tls"):
                findings.append(ThreatFinding(
                    category="INVALID_TLS_CERTIFICATE",
                    severity="HIGH",
                    risk_points=40,
                    description="Final destination has an invalid, expired, or self-signed SSL/TLS certificate.",
                    evidence=str(tls_info.get("error"))
                ))
        elif final_url.startswith("http://"):
            findings.append(ThreatFinding(
                category="UNENCRYPTED_HTTP",
                severity="MEDIUM",
                risk_points=25,
                description="Destination uses unencrypted HTTP instead of HTTPS.",
                evidence=final_url
            ))

        findings.extend(sandbox_data["sandbox_findings"])

        report = DetonationReport(
            input_type=input_type,
            raw_payload=raw_payload,
            payload_scheme=scheme,
            final_url=final_url,
            redirect_chain=redirect_chain,
            risk_score=0,
            safety_score=100,
            verdict="SAFE",
            findings=findings,
            dom_telemetry=sandbox_data["dom_telemetry"],
            tls_info=tls_info,
            screenshot_base64=sandbox_data["screenshot_base64"],
            summary=""
        )
        return self._recalculate_verdict(report)

    def _analyze_non_http_payload(self, payload: str, scheme: str, input_type: str) -> DetonationReport:
        findings: List[ThreatFinding] = []
        if scheme == "upi":
            parsed = urlparse(payload)
            params = {k.lower(): v[0] for k, v in parse_qs(parsed.query).items() if v}
            vpa = params.get("pa", "Unknown")
            payee_name = params.get("pn", "Unknown")
            amount = params.get("am")

            findings.append(ThreatFinding(
                category="UPI_PAYMENT_INTENT",
                severity="INFO",
                risk_points=10,
                description="QR Code initiates an instant UPI payment deduction (scanning a UPI QR only sends money, never receives money).",
                evidence=f"Payee VPA: {vpa} | Name: {payee_name}"
            ))

            if amount and float(amount) > 0:
                findings.append(ThreatFinding(
                    category="UPI_HARDCODED_DEBIT_AMOUNT",
                    severity="HIGH",
                    risk_points=55,
                    description=f"QR code pre-fills an automatic debit of INR {amount}.",
                    evidence=f"am={amount} | pa={vpa} | pn={payee_name}"
                ))

            if any(w in payee_name.lower() for w in ["refund", "cashback", "reward", "prize", "kyc", "verify"]):
                findings.append(ThreatFinding(
                    category="DECEPTIVE_UPI_MERCHANT_NAME",
                    severity="CRITICAL",
                    risk_points=75,
                    description="UPI Payee Name uses social-engineering lure words to trick user into entering UPI PIN.",
                    evidence=f"Payee Name: {payee_name}"
                ))
        elif scheme in {"javascript", "data", "vbscript"}:
            findings.append(ThreatFinding(
                category="INLINE_CODE_OR_DATA_PHISHING",
                severity="CRITICAL",
                risk_points=95,
                description=f"QR/Link embeds an executable or serverless '{scheme}:' payload.",
                evidence=payload[:120]
            ))
        elif payload.upper().startswith("WIFI:"):
            findings.append(ThreatFinding(
                category="AUTO_WIFI_JOIN_PAYLOAD",
                severity="MEDIUM",
                risk_points=35,
                description="QR code forces device to join a Wi-Fi network (potential Rogue Hotspot / MITM attack).",
                evidence=payload[:100]
            ))
        else:
            findings.append(ThreatFinding(
                category="NON_STANDARD_URI_SCHEME",
                severity="MEDIUM",
                risk_points=30,
                description=f"Payload triggers an external device application scheme ('{scheme}:').",
                evidence=payload[:100]
            ))

        report = DetonationReport(
            input_type=input_type,
            raw_payload=payload,
            payload_scheme=scheme or "custom",
            final_url=None,
            redirect_chain=[],
            risk_score=0,
            safety_score=100,
            verdict="SAFE",
            findings=findings,
            summary=""
        )
        return self._recalculate_verdict(report)

    def _analyze_url_lexical(self, url: str, hostname: str, stage: str) -> List[ThreatFinding]:
        findings: List[ThreatFinding] = []
        parsed = urlparse(url)

        if hostname in ThreatSignatures.URL_SHORTENERS:
            findings.append(ThreatFinding(
                category="URL_SHORTENER_OBFUSCATION",
                severity="MEDIUM",
                risk_points=15,
                description=f"{stage} uses a shortener service to conceal the true destination domain.",
                evidence=hostname
            ))

        try:
            ipaddress.ip_address(hostname)
            findings.append(ThreatFinding(
                category="RAW_IP_ADDRESS_HOST",
                severity="HIGH",
                risk_points=50,
                description=f"{stage} uses a raw IP address instead of a registered domain.",
                evidence=hostname
            ))
        except ValueError:
            pass

        if "@" in parsed.netloc:
            findings.append(ThreatFinding(
                category="URI_USERINFO_SPOOFING",
                severity="CRITICAL",
                risk_points=80,
                description=f"{stage} contains an '@' symbol to disguise destination host.",
                evidence=parsed.netloc
            ))

        if "xn--" in hostname:
            findings.append(ThreatFinding(
                category="PUNYCODE_HOMOGRAPH_DOMAIN",
                severity="HIGH",
                risk_points=65,
                description=f"{stage} uses Internationalized Punycode ('xn--') to spoof characters.",
                evidence=hostname
            ))

        for tld in ThreatSignatures.HIGH_RISK_TLDS:
            if hostname.endswith(tld):
                findings.append(ThreatFinding(
                    category="HIGH_RISK_ABUSED_TLD",
                    severity="MEDIUM",
                    risk_points=25,
                    description=f"{stage} uses high-abuse top-level domain '{tld}'.",
                    evidence=hostname
                ))
                break

        domain_parts = hostname.split(".")
        for brand, official_domains in ThreatSignatures.PROTECTED_BRANDS.items():
            if not any(hostname == d or hostname.endswith("." + d) for d in official_domains):
                if brand in hostname:
                    findings.append(ThreatFinding(
                        category="BRAND_SUBDOMAIN_OR_COMPOUND_SPOOF",
                        severity="CRITICAL",
                        risk_points=75,
                        description=f"{stage} embeds protected brand name '{brand}' inside unauthorized host.",
                        evidence=f"Host '{hostname}' is not an official {brand.upper()} domain."
                    ))
                else:
                    sld = domain_parts[-2] if len(domain_parts) >= 2 else hostname
                    if len(brand) >= 5 and 1 <= levenshtein_distance(sld, brand) <= 1:
                        findings.append(ThreatFinding(
                            category="BRAND_TYPOSQUATTING",
                            severity="HIGH",
                            risk_points=70,
                            description=f"{stage} domain label '{sld}' is a 1-character typosquat of '{brand}'.",
                            evidence=hostname
                        ))

        if parsed.path.lower().endswith(ThreatSignatures.DANGEROUS_EXTENSIONS):
            findings.append(ThreatFinding(
                category="DIRECT_MALWARE_OR_APK_PAYLOAD",
                severity="CRITICAL",
                risk_points=90,
                description=f"{stage} points directly to an executable or mobile APK file.",
                evidence=parsed.path
            ))

        return findings

    async def _run_playwright_sandbox(self, start_url: str) -> Dict[str, Any]:
        redirect_chain = [start_url]
        sandbox_findings: List[ThreatFinding] = []
        intercepted_downloads: List[str] = []
        suspicious_network_calls: List[str] = []
        screenshot_b64: Optional[str] = None
        dom_telemetry: Dict[str, Any] = {}
        final_url = start_url

        try:
            async with async_playwright() as p:
                browser = await p.chromium.launch(
                    headless=True,
                    args=["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]
                )
                context = await browser.new_context(
                    user_agent="Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/128.0.0.0 Mobile Safari/537.36",
                    viewport={"width": 412, "height": 915},
                    accept_downloads=False,
                    ignore_https_errors=True
                )
                page = await context.new_page()

                def on_request(req: Request):
                    req_url = req.url
                    if "api.telegram.org/bot" in req_url or "discord.com/api/webhooks" in req_url:
                        suspicious_network_calls.append(req_url)

                def on_response(resp: Response):
                    if resp.request.is_navigation_request() and resp.url not in redirect_chain:
                        redirect_chain.append(resp.url)

                def on_download(download: Download):
                    intercepted_downloads.append(f"{download.suggested_filename} ({download.url})")

                page.on("request", on_request)
                page.on("response", on_response)
                page.on("download", on_download)

                await page.goto(start_url, wait_until="domcontentloaded", timeout=12000)
                await page.wait_for_timeout(1800)
                final_url = page.url
                if final_url not in redirect_chain:
                    redirect_chain.append(final_url)

                dom_telemetry = await page.evaluate("""
                () => {
                    const passwordInputs = document.querySelectorAll('input[type="password"]').length;
                    const otpInputs = document.querySelectorAll('input[name*="otp" i], input[id*="otp" i], input[placeholder*="otp" i], input[name*="pin" i]').length;
                    const cardInputs = document.querySelectorAll('input[name*="card" i], input[name*="cvv" i], input[autocomplete*="cc-"]').length;
                    const forms = Array.from(document.querySelectorAll('form')).map(f => f.action || '');
                    return {
                        title: document.title || '',
                        password_fields: passwordInputs,
                        otp_or_pin_fields: otpInputs,
                        credit_card_fields: cardInputs,
                        form_actions: forms.slice(0, 5)
                    };
                }
                """)
                png_bytes = await page.screenshot(type="png", full_page=False)
                screenshot_b64 = base64.b64encode(png_bytes).decode("utf-8")
                await browser.close()
        except Exception as e:
            dom_telemetry = {"sandbox_navigation_note": str(e)}

        if intercepted_downloads:
            sandbox_findings.append(ThreatFinding(
                category="DRIVE_BY_MALWARE_DOWNLOAD",
                severity="CRITICAL",
                risk_points=90,
                description="Page automatically triggered an executable/APK file download upon navigation.",
                evidence=", ".join(intercepted_downloads)
            ))

        if suspicious_network_calls:
            sandbox_findings.append(ThreatFinding(
                category="TELEGRAM_OR_WEBHOOK_EXFILTRATION",
                severity="CRITICAL",
                risk_points=95,
                description="Page communicates with Telegram Bot API or Discord Webhook to exfiltrate credentials.",
                evidence=suspicious_network_calls[0][:100]
            ))

        pw_count = dom_telemetry.get("password_fields", 0)
        otp_count = dom_telemetry.get("otp_or_pin_fields", 0)
        final_host = (urlparse(final_url).hostname or "").lower()
        page_title = (dom_telemetry.get("title") or "").lower()

        if pw_count > 0 or otp_count > 0:
            sandbox_findings.append(ThreatFinding(
                category="CREDENTIAL_OR_PAYMENT_HARVESTING_DOM",
                severity="HIGH",
                risk_points=35,
                description="Rendered DOM contains live password or OTP/PIN input fields.",
                evidence=f"Password inputs: {pw_count}, OTP/PIN inputs: {otp_count}"
            ))

        for brand, official_domains in ThreatSignatures.PROTECTED_BRANDS.items():
            if brand in page_title and not any(final_host == d or final_host.endswith("." + d) for d in official_domains):
                sandbox_findings.append(ThreatFinding(
                    category="ZERO_DAY_BRAND_IMPERSONATION_PHISH",
                    severity="CRITICAL",
                    risk_points=85,
                    description=f"Page title claims to be '{brand.upper()}' while hosted on unauthorized domain '{final_host}'.",
                    evidence=f"Title: '{dom_telemetry.get('title')}' | Host: '{final_host}'"
                ))

        return {
            "final_url": final_url,
            "redirect_chain": redirect_chain,
            "sandbox_findings": sandbox_findings,
            "dom_telemetry": dom_telemetry,
            "screenshot_base64": screenshot_b64
        }

    def _recalculate_verdict(self, report: DetonationReport) -> DetonationReport:
        total_risk = sum(f.risk_points for f in report.findings)
        has_critical = any(f.severity == "CRITICAL" for f in report.findings)
        if has_critical:
            total_risk = max(total_risk, 80)
        risk_score = min(100, max(0, total_risk))
        safety_score = 100 - risk_score

        if risk_score >= 65:
            verdict = "MALICIOUS"
            summary = (
                f"DANGER ({risk_score}/100 Risk): Highly dangerous {report.input_type}. "
                f"Do NOT visit the link, enter credentials, or approve any payment prompts."
            )
        elif risk_score >= 30:
            verdict = "SUSPICIOUS"
            summary = (
                f"CAUTION ({risk_score}/100 Risk): This {report.input_type} exhibits suspicious traits "
                f"(link obfuscation, unusual redirects, or payment prompts)."
            )
        else:
            verdict = "SAFE"
            summary = (
                f"SAFE ({safety_score}% Trust Score): Clean detonation. "
                f"No phishing forms, drive-by downloads, or domain spoofing detected."
            )

        report.risk_score = risk_score
        report.safety_score = safety_score
        report.verdict = verdict
        report.summary = summary
        return report

