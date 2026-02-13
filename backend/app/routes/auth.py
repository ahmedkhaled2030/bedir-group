from fastapi import APIRouter, HTTPException, status
from datetime import datetime, timezone
from bson import ObjectId

from app.models import UserCreate, UserLogin, UserOut, Token, UserRole
from app.auth import hash_password, verify_password, create_access_token
from app.database import get_db

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


def user_doc_to_out(doc: dict) -> UserOut:
    return UserOut(
        id=str(doc["_id"]),
        email=doc["email"],
        name=doc["name"],
        role=doc["role"],
        created_at=doc["created_at"],
    )


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(data: UserCreate):
    db = get_db()

    # Check if email exists
    existing = await db.users.find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # First user becomes admin
    user_count = await db.users.count_documents({})
    role = UserRole.admin if user_count == 0 else UserRole.user

    user_doc = {
        "email": data.email,
        "name": data.name,
        "password": hash_password(data.password),
        "role": role.value,
        "created_at": datetime.now(timezone.utc),
    }

    result = await db.users.insert_one(user_doc)
    user_doc["_id"] = result.inserted_id

    token = create_access_token({"sub": str(result.inserted_id)})
    user_out = user_doc_to_out(user_doc)

    return Token(access_token=token, user=user_out)


@router.post("/login", response_model=Token)
async def login(data: UserLogin):
    db = get_db()

    user = await db.users.find_one({"email": data.email})
    if not user or not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": str(user["_id"])})
    user_out = user_doc_to_out(user)

    return Token(access_token=token, user=user_out)


@router.get("/me", response_model=UserOut)
async def get_me(current_user: dict = None):
    """Get current user - requires token via dependency injection at route level."""
    from fastapi import Depends
    from app.auth import get_current_user
    # This endpoint needs special handling - see main.py route inclusion
    pass


# Separate me endpoint with dependency
from fastapi import Depends
from app.auth import get_current_user


@router.get("/profile", response_model=UserOut)
async def get_profile(current_user: dict = Depends(get_current_user)):
    return UserOut(**current_user)
