from fastapi import APIRouter
router = APIRouter(prefix="/public", tags=["public"])

@router.get("/")
async def root():
    return {"status": "ok", "version": "1.0.0", "name": "Bookando API"}

@router.get("/health")
async def health():
    return {"status": "healthy", "app": "bookando-api"}
