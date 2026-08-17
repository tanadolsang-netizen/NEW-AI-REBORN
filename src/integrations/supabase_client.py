import os
from dotenv import load_dotenv
from supabase import create_client, Client
from fastapi import Depends
from pydantic import BaseModel

load_dotenv()

_supabase: Client | None = None


def init_supabase() -> None:
    global _supabase
    if _supabase is None:
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        if not url or not key:
            raise RuntimeError("SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY missing")
        _supabase = create_client(url, key)


class User(BaseModel):
    id: str
    email: str


async def get_current_user(authorization: str = "") -> User:
    if not _supabase:
        raise RuntimeError("Supabase not initialized")
    if not authorization.startswith("Bearer "):
        raise ValueError("Missing Bearer token")
    token = authorization.split(" ", 1)[1]
    res = _supabase.auth.get_user(token)
    if not res.user:
        raise ValueError("Unauthorized")
    return User(id=res.user.id, email=res.user.email)
