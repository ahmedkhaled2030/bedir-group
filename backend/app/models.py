from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from enum import Enum


# ─── Auth / User ───────────────────────────────────────────

class UserRole(str, Enum):
    admin = "admin"
    user = "user"


class UserBase(BaseModel):
    email: EmailStr
    name: str


class UserCreate(UserBase):
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(UserBase):
    id: str
    role: UserRole
    created_at: datetime

    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# ─── Blog ──────────────────────────────────────────────────

class BlogStatus(str, Enum):
    draft = "draft"
    published = "published"


class LocalizedText(BaseModel):
    en: str = ""
    ar: str = ""
    fr: str = ""
    de: str = ""


class BlogPostBase(BaseModel):
    title: LocalizedText = LocalizedText()
    excerpt: LocalizedText = LocalizedText()
    content: Optional[dict] = None  # TipTap JSON
    cover_image: str = ""
    category: str = ""
    tags: list[str] = []
    featured: bool = False
    status: BlogStatus = BlogStatus.draft


class BlogPostCreate(BlogPostBase):
    pass


class BlogPostUpdate(BlogPostBase):
    pass


class BlogPostOut(BlogPostBase):
    id: str
    slug: str
    author_id: str
    author_name: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ─── Careers ───────────────────────────────────────────────

class CareerStatus(str, Enum):
    active = "active"
    closed = "closed"


class CareerPostBase(BaseModel):
    title: LocalizedText = LocalizedText()
    department: LocalizedText = LocalizedText()
    description: LocalizedText = LocalizedText()
    requirements: dict[str, list[str]] = {"en": [], "ar": [], "fr": [], "de": []}
    benefits: dict[str, list[str]] = {"en": [], "ar": [], "fr": [], "de": []}
    location: str = ""
    job_type: str = "full-time"
    salary: str = ""
    application_email: str = ""
    status: CareerStatus = CareerStatus.active


class CareerPostCreate(CareerPostBase):
    pass


class CareerPostUpdate(CareerPostBase):
    pass


class CareerPostOut(CareerPostBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ─── Contact Inquiries ─────────────────────────────────────

class ContactInquiryCreate(BaseModel):
    full_name: str
    phone_number: str
    email: EmailStr
    city: str = ""
    service_type: str = ""
    project_type: str = ""
    budget: str = ""
    message: str = ""


class ContactInquiryOut(ContactInquiryCreate):
    id: str
    read: bool = False
    created_at: datetime

    model_config = {"from_attributes": True}
