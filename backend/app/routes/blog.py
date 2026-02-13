from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Query
from fastapi.responses import Response
from datetime import datetime, timezone
from typing import Optional
from bson import ObjectId
import re
import os
import uuid
import base64

from app.models import (
    BlogPostCreate,
    BlogPostUpdate,
    BlogPostOut,
    BlogStatus,
)
from app.auth import get_current_user, get_admin_user
from app.database import get_db
from app.config import get_settings

settings = get_settings()
router = APIRouter(prefix="/api/blog", tags=["Blog"])


def generate_slug(title: str) -> str:
    slug = title.lower().strip()
    slug = re.sub(r"[^\w\s-]", "", slug)
    slug = re.sub(r"[\s_]+", "-", slug)
    slug = re.sub(r"-+", "-", slug)
    return slug[:80].strip("-")


def doc_to_out(doc: dict) -> BlogPostOut:
    return BlogPostOut(
        id=str(doc["_id"]),
        title=doc.get("title", {}),
        excerpt=doc.get("excerpt", {}),
        content=doc.get("content"),
        cover_image=doc.get("cover_image", ""),
        category=doc.get("category", ""),
        tags=doc.get("tags", []),
        featured=doc.get("featured", False),
        status=doc.get("status", "draft"),
        slug=doc.get("slug", ""),
        author_id=doc.get("author_id", ""),
        author_name=doc.get("author_name", ""),
        created_at=doc.get("created_at", datetime.now(timezone.utc)),
        updated_at=doc.get("updated_at", datetime.now(timezone.utc)),
    )


# ─── Public endpoints ─────────────────────────────────────

@router.get("/posts", response_model=list[BlogPostOut])
async def get_published_posts(
    category: Optional[str] = None,
    search: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
):
    db = get_db()
    query: dict = {"status": "published"}

    if category:
        query["category"] = category
    if search:
        query["$or"] = [
            {"title.en": {"$regex": search, "$options": "i"}},
            {"title.ar": {"$regex": search, "$options": "i"}},
            {"title.fr": {"$regex": search, "$options": "i"}},
            {"title.de": {"$regex": search, "$options": "i"}},
            {"tags": {"$regex": search, "$options": "i"}},
        ]

    skip = (page - 1) * limit
    cursor = db.blog_posts.find(query).sort("created_at", -1).skip(skip).limit(limit)
    posts = await cursor.to_list(length=limit)
    return [doc_to_out(p) for p in posts]


@router.get("/posts/{slug}", response_model=BlogPostOut)
async def get_post_by_slug(slug: str):
    db = get_db()
    post = await db.blog_posts.find_one({"slug": slug, "status": "published"})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return doc_to_out(post)


# ─── Admin endpoints ──────────────────────────────────────

@router.get("/admin/posts", response_model=list[BlogPostOut])
async def get_all_posts(
    status: Optional[str] = None,
    search: Optional[str] = None,
    admin: dict = Depends(get_admin_user),
):
    db = get_db()
    query: dict = {}

    if status:
        query["status"] = status
    if search:
        query["$or"] = [
            {"title.en": {"$regex": search, "$options": "i"}},
            {"title.ar": {"$regex": search, "$options": "i"}},
        ]

    cursor = db.blog_posts.find(query).sort("created_at", -1)
    posts = await cursor.to_list(length=200)
    return [doc_to_out(p) for p in posts]


@router.get("/admin/posts/{post_id}", response_model=BlogPostOut)
async def get_post_by_id(post_id: str, admin: dict = Depends(get_admin_user)):
    db = get_db()
    post = await db.blog_posts.find_one({"_id": ObjectId(post_id)})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return doc_to_out(post)


@router.post("/admin/posts", response_model=BlogPostOut, status_code=201)
async def create_post(data: BlogPostCreate, admin: dict = Depends(get_admin_user)):
    db = get_db()

    slug = generate_slug(data.title.en or data.title.ar or "untitled")

    # Ensure unique slug
    existing = await db.blog_posts.find_one({"slug": slug})
    if existing:
        slug = f"{slug}-{uuid.uuid4().hex[:6]}"

    now = datetime.now(timezone.utc)
    doc = {
        **data.model_dump(),
        "slug": slug,
        "author_id": admin["id"],
        "author_name": admin["name"],
        "created_at": now,
        "updated_at": now,
    }

    result = await db.blog_posts.insert_one(doc)
    doc["_id"] = result.inserted_id
    return doc_to_out(doc)


@router.put("/admin/posts/{post_id}", response_model=BlogPostOut)
async def update_post(post_id: str, data: BlogPostUpdate, admin: dict = Depends(get_admin_user)):
    db = get_db()

    existing = await db.blog_posts.find_one({"_id": ObjectId(post_id)})
    if not existing:
        raise HTTPException(status_code=404, detail="Post not found")

    update_data = data.model_dump()
    update_data["updated_at"] = datetime.now(timezone.utc)

    # Update slug if English title changed
    new_slug = generate_slug(data.title.en or data.title.ar or "untitled")
    if new_slug != existing.get("slug"):
        slug_exists = await db.blog_posts.find_one({"slug": new_slug, "_id": {"$ne": ObjectId(post_id)}})
        if slug_exists:
            new_slug = f"{new_slug}-{uuid.uuid4().hex[:6]}"
        update_data["slug"] = new_slug

    await db.blog_posts.update_one({"_id": ObjectId(post_id)}, {"$set": update_data})

    updated = await db.blog_posts.find_one({"_id": ObjectId(post_id)})
    return doc_to_out(updated)


@router.delete("/admin/posts/{post_id}", status_code=204)
async def delete_post(post_id: str, admin: dict = Depends(get_admin_user)):
    db = get_db()
    result = await db.blog_posts.delete_one({"_id": ObjectId(post_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")


# ─── Image Upload ──────────────────────────────────────────

@router.post("/upload-image")
async def upload_image(
    file: UploadFile = File(...),
    admin: dict = Depends(get_admin_user),
):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files allowed")

    content = await file.read()
    if len(content) > settings.MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large (max 10MB)")

    ext = file.filename.split(".")[-1] if file.filename else "jpg"
    filename = f"{uuid.uuid4().hex}.{ext}"

    # Store image in MongoDB for serverless compatibility
    db = get_db()
    await db.images.insert_one({
        "filename": filename,
        "content_type": file.content_type,
        "data": base64.b64encode(content).decode("utf-8"),
        "created_at": datetime.now(timezone.utc),
    })

    return {"url": f"/api/blog/images/{filename}"}


@router.get("/images/{filename}")
async def get_image(filename: str):
    db = get_db()
    image = await db.images.find_one({"filename": filename})
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")

    data = base64.b64decode(image["data"])
    return Response(
        content=data,
        media_type=image.get("content_type", "image/jpeg"),
        headers={"Cache-Control": "public, max-age=31536000, immutable"},
    )
