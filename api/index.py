from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from routes.auth import router as auth_router
from routes.public import router as public_router

app = FastAPI(title="Bookando API", version="1.0.0", docs_url="/api/docs")

origins = [o.strip() for o in settings.CORS_ORIGINS.split(",")]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

api = APIRouter(prefix="/api")
api.include_router(public_router)
api.include_router(auth_router)
app.include_router(api)

@app.get("/")
async def root():
    return {"status": "ok", "app": "Bookando API"}
