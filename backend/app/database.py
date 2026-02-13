from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.config import get_settings

settings = get_settings()

client: AsyncIOMotorClient | None = None
db: AsyncIOMotorDatabase | None = None
_indexes_created: bool = False


async def connect_db():
    """Connect to MongoDB and create indexes. Safe to call multiple times."""
    global client, db, _indexes_created
    if db is not None:
        return

    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.DATABASE_NAME]

    if not _indexes_created:
        try:
            await db.users.create_index("email", unique=True)
            await db.blog_posts.create_index("slug", unique=True)
            await db.blog_posts.create_index([("status", 1), ("created_at", -1)])
            await db.career_posts.create_index([("status", 1), ("created_at", -1)])
            _indexes_created = True
        except Exception:
            pass  # Indexes may already exist

    print(f"✓ Connected to MongoDB: {settings.DATABASE_NAME}")


async def close_db():
    global client, db
    if client:
        client.close()
        client = None
        db = None
        print("✗ Disconnected from MongoDB")


def get_db() -> AsyncIOMotorDatabase:
    """Get database instance. Lazily connects if not yet initialized (for serverless)."""
    global client, db
    if db is None:
        # Lazy connection for serverless environments where lifespan may not fire
        client = AsyncIOMotorClient(settings.MONGODB_URL)
        db = client[settings.DATABASE_NAME]
    return db
