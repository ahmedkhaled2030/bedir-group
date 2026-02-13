from fastapi import APIRouter, HTTPException, Depends, Query
from datetime import datetime, timezone
from typing import Optional
from bson import ObjectId

from app.models import (
    CareerPostCreate,
    CareerPostUpdate,
    CareerPostOut,
)
from app.auth import get_admin_user
from app.database import get_db

router = APIRouter(prefix="/api/careers", tags=["Careers"])


def doc_to_out(doc: dict) -> CareerPostOut:
    return CareerPostOut(
        id=str(doc["_id"]),
        title=doc.get("title", {}),
        department=doc.get("department", {}),
        description=doc.get("description", {}),
        requirements=doc.get("requirements", {"en": [], "ar": [], "fr": [], "de": []}),
        benefits=doc.get("benefits", {"en": [], "ar": [], "fr": [], "de": []}),
        location=doc.get("location", ""),
        job_type=doc.get("job_type", "full-time"),
        salary=doc.get("salary", ""),
        application_email=doc.get("application_email", ""),
        status=doc.get("status", "active"),
        created_at=doc.get("created_at", datetime.now(timezone.utc)),
        updated_at=doc.get("updated_at", datetime.now(timezone.utc)),
    )


# ─── Public endpoints ─────────────────────────────────────

@router.get("/posts", response_model=list[CareerPostOut])
async def get_active_careers(
    search: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
):
    db = get_db()
    query: dict = {"status": "active"}

    if search:
        query["$or"] = [
            {"title.en": {"$regex": search, "$options": "i"}},
            {"title.ar": {"$regex": search, "$options": "i"}},
            {"department.en": {"$regex": search, "$options": "i"}},
            {"location": {"$regex": search, "$options": "i"}},
        ]

    skip = (page - 1) * limit
    cursor = db.career_posts.find(query).sort("created_at", -1).skip(skip).limit(limit)
    posts = await cursor.to_list(length=limit)
    return [doc_to_out(p) for p in posts]


# ─── Admin endpoints ──────────────────────────────────────

@router.get("/admin/posts", response_model=list[CareerPostOut])
async def get_all_careers(
    search: Optional[str] = None,
    admin: dict = Depends(get_admin_user),
):
    db = get_db()
    query: dict = {}
    if search:
        query["$or"] = [
            {"title.en": {"$regex": search, "$options": "i"}},
            {"title.ar": {"$regex": search, "$options": "i"}},
        ]

    cursor = db.career_posts.find(query).sort("created_at", -1)
    posts = await cursor.to_list(length=200)
    return [doc_to_out(p) for p in posts]


@router.get("/admin/posts/{post_id}", response_model=CareerPostOut)
async def get_career_by_id(post_id: str, admin: dict = Depends(get_admin_user)):
    db = get_db()
    post = await db.career_posts.find_one({"_id": ObjectId(post_id)})
    if not post:
        raise HTTPException(status_code=404, detail="Career not found")
    return doc_to_out(post)


@router.post("/admin/posts", response_model=CareerPostOut, status_code=201)
async def create_career(data: CareerPostCreate, admin: dict = Depends(get_admin_user)):
    db = get_db()
    now = datetime.now(timezone.utc)
    doc = {
        **data.model_dump(),
        "created_at": now,
        "updated_at": now,
    }
    result = await db.career_posts.insert_one(doc)
    doc["_id"] = result.inserted_id
    return doc_to_out(doc)


@router.put("/admin/posts/{post_id}", response_model=CareerPostOut)
async def update_career(post_id: str, data: CareerPostUpdate, admin: dict = Depends(get_admin_user)):
    db = get_db()
    existing = await db.career_posts.find_one({"_id": ObjectId(post_id)})
    if not existing:
        raise HTTPException(status_code=404, detail="Career not found")

    update_data = data.model_dump()
    update_data["updated_at"] = datetime.now(timezone.utc)

    await db.career_posts.update_one({"_id": ObjectId(post_id)}, {"$set": update_data})
    updated = await db.career_posts.find_one({"_id": ObjectId(post_id)})
    return doc_to_out(updated)


@router.delete("/admin/posts/{post_id}", status_code=204)
async def delete_career(post_id: str, admin: dict = Depends(get_admin_user)):
    db = get_db()
    result = await db.career_posts.delete_one({"_id": ObjectId(post_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Career not found")
