# FastAPI ASGI app factory
import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv

# Must run before any integration module reads env vars (stripe_client sets
# stripe.api_key at import time), and before the routers package pulls those
# integrations in transitively.
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import natal, transit, synastry, branches, payments, health, auth, notifications, dashboard, memory
from .integrations.supabase_client import init_supabase
from .integrations.stripe_client import init_stripe

ENV = os.getenv("ENV", "dev")
ALLOWED_ORIGINS = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "").split(",") if o.strip()]


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

# A wildcard origin ("*") is incompatible with allow_credentials=True per the
# fetch/CORS spec (browsers reject the response outright), so dev mode still
# needs an explicit allowlist rather than "*".
_default_dev_origins = ["http://localhost:3000", "http://127.0.0.1:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS or (_default_dev_origins if ENV == "dev" else ["https://astral.app"]),
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
app.include_router(dashboard.router, prefix="/v1/dashboard", tags=["dashboard"])
app.include_router(payments.router, prefix="/v1/payments", tags=["payments"])
app.include_router(notifications.router, prefix="/v1/notifications", tags=["notifications"])
app.include_router(memory.router, prefix="/v1/memory", tags=["memory"])
