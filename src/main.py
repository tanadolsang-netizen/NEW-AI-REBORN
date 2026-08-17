# FastAPI ASGI app factory
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import natal, transit, synastry, branches, payments, health, auth, notifications
from .integrations.supabase_client import init_supabase
from .integrations.stripe_client import init_stripe
import os

ENV = os.getenv("ENV", "dev")


@asynccontextmanager
async def lifespan(app: FastAPI):
    if os.getenv("SUPABASE_URL"):
        init_supabase()
    if os.getenv("STRIPE_SECRET_KEY"):
        init_stripe()
    yield


app = FastAPI(
    title="Astral Backend",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if ENV == "dev" else ["https://astral.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, tags=["health"])
app.include_router(auth.router, prefix="/v1/auth", tags=["auth"])
app.include_router(natal.router, prefix="/v1/natal", tags=["natal"])
app.include_router(transit.router, prefix="/v1/transit", tags=["transit"])
app.include_router(synastry.router, prefix="/v1/synastry", tags=["synastry"])
app.include_router(branches.router, prefix="/v1/branches", tags=["branches"])
app.include_router(payments.router, prefix="/v1/payments", tags=["payments"])
app.include_router(notifications.router, prefix="/v1/notifications", tags=["notifications"])
