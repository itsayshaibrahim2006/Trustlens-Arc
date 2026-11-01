from fastapi import FastAPI, UploadFile, File, HTTPException
from models.forensic_authenticator import (
    GoogleJobScamAndCVAuthenticator,
    extract_pdf_forensics,
    ForensicAuditReport
)

app = FastAPI(
    title="Google Job Scam & CV Authenticator API",
    version="2.0.0"
)
authenticator = GoogleJobScamAndCVAuthenticator()

@app.post("/api/v1/authenticate-document", response_model=ForensicAuditReport)
async def authenticate_document(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported for binary metadata forensics.")

    pdf_bytes = await file.read()
    forensics = extract_pdf_forensics(pdf_bytes)
    doc_type = authenticator.classify_document_intent(forensics["text"])

    if doc_type == "EMPLOYMENT_OFFER_LETTER":
        return authenticator.evaluate_offer_letter(
            text=forensics["text"],
            metadata=forensics["metadata"],
            hidden_uris=forensics["hidden_uris"]
        )
    else:
        return await authenticator.evaluate_candidate_resume(
            text=forensics["text"],
            metadata=forensics["metadata"],
            hidden_uris=forensics["hidden_uris"]
        )
