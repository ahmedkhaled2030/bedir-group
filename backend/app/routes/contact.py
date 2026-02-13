from fastapi import APIRouter, Depends, Query
from datetime import datetime, timezone
from typing import Optional
from bson import ObjectId

from app.models import ContactInquiryCreate, ContactInquiryOut
from app.auth import get_admin_user
from app.database import get_db

router = APIRouter(prefix="/api/contact", tags=["Contact"])


def doc_to_out(doc: dict) -> ContactInquiryOut:
    return ContactInquiryOut(
        id=str(doc["_id"]),
        full_name=doc.get("full_name", ""),
        phone_number=doc.get("phone_number", ""),
        email=doc.get("email", ""),
        city=doc.get("city", ""),
        service_type=doc.get("service_type", ""),
        project_type=doc.get("project_type", ""),
        budget=doc.get("budget", ""),
        message=doc.get("message", ""),
        read=doc.get("read", False),
        created_at=doc.get("created_at", datetime.now(timezone.utc)),
    )


# ─── Public: Submit a consultation inquiry ─────────────────

@router.post("/inquiries", response_model=ContactInquiryOut, status_code=201)
async def create_inquiry(data: ContactInquiryCreate):
    db = get_db()
    now = datetime.now(timezone.utc)
    doc = {
        **data.model_dump(),
        "read": False,
        "created_at": now,
    }
    result = await db.contact_inquiries.insert_one(doc)
    doc["_id"] = result.inserted_id
    return doc_to_out(doc)


# ─── Admin: List all inquiries ─────────────────────────────

@router.get("/admin/inquiries", response_model=list[ContactInquiryOut])
async def get_all_inquiries(
    read: Optional[bool] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200),
    admin: dict = Depends(get_admin_user),
):
    db = get_db()
    query: dict = {}
    if read is not None:
        query["read"] = read

    skip = (page - 1) * limit
    cursor = db.contact_inquiries.find(query).sort("created_at", -1).skip(skip).limit(limit)
    docs = await cursor.to_list(length=limit)
    return [doc_to_out(d) for d in docs]


# ─── Admin: Mark inquiry as read ──────────────────────────

@router.patch("/admin/inquiries/{inquiry_id}", response_model=ContactInquiryOut)
async def mark_inquiry_read(inquiry_id: str, admin: dict = Depends(get_admin_user)):
    db = get_db()
    await db.contact_inquiries.update_one(
        {"_id": ObjectId(inquiry_id)},
        {"$set": {"read": True}},
    )
    doc = await db.contact_inquiries.find_one({"_id": ObjectId(inquiry_id)})
    if not doc:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return doc_to_out(doc)


# ─── Admin: Delete inquiry ────────────────────────────────

@router.delete("/admin/inquiries/{inquiry_id}", status_code=204)
async def delete_inquiry(inquiry_id: str, admin: dict = Depends(get_admin_user)):
    db = get_db()
    from fastapi import HTTPException
    result = await db.contact_inquiries.delete_one({"_id": ObjectId(inquiry_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Inquiry not found")
