from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from db import connect_db
from security import hash_password, verify_password, create_access_token, create_refresh_token, decode_token

router = APIRouter(prefix="/auth", tags=["auth"])

class RegisterRequest(BaseModel):
    email: str
    password: str
    first_name: str = ""
    last_name: str = ""
    role: str = "customer"

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/register")
async def register(req: RegisterRequest):
    db = await connect_db()
    existing = await db.users.find_one({"email": req.email})
    if existing:
        raise HTTPException(400, detail="Email already registered")
    user = {
        "email": req.email,
        "password": hash_password(req.password),
        "first_name": req.first_name,
        "last_name": req.last_name,
        "role": req.role,
        "created_at": None,
    }
    result = await db.users.insert_one(user)
    return {"id": str(result.inserted_id), "email": req.email}

@router.post("/login")
async def login(req: LoginRequest):
    db = await connect_db()
    user = await db.users.find_one({"email": req.email})
    if not user or not verify_password(req.password, user["password"]):
        raise HTTPException(401, detail="Invalid credentials")
    token_data = {"sub": req.email, "role": user["role"]}
    return {
        "access_token": create_access_token(token_data),
        "refresh_token": create_refresh_token(token_data),
        "user": {"email": user["email"], "role": user["role"], "first_name": user.get("first_name", "")},
    }

@router.post("/refresh")
async def refresh(token: str):
    payload = decode_token(token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(401, detail="Invalid refresh token")
    return {"access_token": create_access_token({"sub": payload["sub"], "role": payload.get("role")})}
