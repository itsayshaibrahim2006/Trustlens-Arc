from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
from models.forensic_authenticator import (
    GoogleJobScamAndCVAuthenticator,
    extract_pdf_forensics,
    ForensicAuditReport
)
from models.detonator_engine import (
    QRAndLinkDetonator,
    DetonationReport
)

app = FastAPI(
    title="TrustLens Arc — Enterprise AI Threat Intelligence & Forensics API",
    version="2.0.0"
)

cv_authenticator = GoogleJobScamAndCVAuthenticator()
qr_detonator = QRAndLinkDetonator()


class URLDetonateRequest(BaseModel):
    url: str


# =====================================================================
# 1. GOOGLE JOB SCAM & CV / RESUME AUTHENTICATOR
# =====================================================================
@app.post("/api/v1/authenticate-document", response_model=ForensicAuditReport)
async def authenticate_document(file: UploadFile = File(...)):
    """Parses PDF binary headers and classifies whether document is an Offer Scam or Candidate CV."""
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported for binary metadata forensics.")

    pdf_bytes = await file.read()
    forensics = extract_pdf_forensics(pdf_bytes)
    doc_type = cv_authenticator.classify_document_intent(forensics["text"])

    if doc_type == "EMPLOYMENT_OFFER_LETTER":
        return cv_authenticator.evaluate_offer_letter(
            text=forensics["text"],
            metadata=forensics["metadata"],
            hidden_uris=forensics["hidden_uris"]
        )
    else:
        return await cv_authenticator.evaluate_candidate_resume(
            text=forensics["text"],
            metadata=forensics["metadata"],
            hidden_uris=forensics["hidden_uris"]
        )


# =====================================================================
# 2. QR CODE & FAKE LINK HEADLESS SANDBOX DETONATOR
# =====================================================================
@app.post("/api/v1/detonate-url", response_model=DetonationReport)
async def detonate_url_endpoint(payload: URLDetonateRequest):
    """Detonates a raw URL or URI scheme (UPI, data:) in the isolated headless sandbox."""
    if not payload.url or not payload.url.strip():
        raise HTTPException(status_code=400, detail="URL cannot be empty.")
    return await qr_detonator.detonate_payload(payload.url, input_type="RAW_URL")


@app.post("/api/v1/detonate-qr", response_model=DetonationReport)
async def detonate_qr_endpoint(file: UploadFile = File(...)):
    """Decodes multi-pass QR image and detonates the extracted payload."""
    image_bytes = await file.read()
    try:
        return await qr_detonator.detonate_qr_image(image_bytes)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
