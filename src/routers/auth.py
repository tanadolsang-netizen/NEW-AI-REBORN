from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr

router = APIRouter()


class SignupIn(BaseModel):
    email: EmailStr
    password: str
    full_name: str | None = None


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"


@router.post("/signup", response_model=TokenOut)
async def signup(body: SignupIn):
    # Placeholder: wire to Supabase Auth REST `/auth/v1/signup` here
    return TokenOut(access_token="dev-" + body.email)


@router.post("/login", response_model=TokenOut)
async def login(body: LoginIn):
    # Placeholder: wire to Supabase Auth REST `/auth/v1/token?grant_type=password` here
    return TokenOut(access_token="dev-" + body.email)


@router.get("/me")
async def me():
    return {"user": {"email": "dev@example.com"}, "plan": "free"}
