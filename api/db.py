from motor.motor_asyncio import AsyncIOMotorClient
from config import settings

client = None
db = None

async def connect_db():
    global client, db
    if client is None:
        client = AsyncIOMotorClient(settings.MONGO_URL)
        db = client[settings.DB_NAME]
    return db

async def close_db():
    global client
    if client:
        client.close()
        client = None
