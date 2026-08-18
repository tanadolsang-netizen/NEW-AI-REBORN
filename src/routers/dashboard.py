from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class RecentIn(BaseModel):
    limit: int = 5


class RecentItem(BaseModel):
    name: str
    datetime_utc: str
    system: str


class RecentOut(BaseModel):
    recent: list[RecentItem]


_DEMO_RECENT = [
    RecentItem(name="Somchai N.", datetime_utc="2026-08-14T09:12:00Z", system="tropical"),
    RecentItem(name="Nira K.", datetime_utc="2026-08-12T22:40:00Z", system="sidereal"),
    RecentItem(name="Ploy S.", datetime_utc="2026-08-09T03:05:00Z", system="tropical"),
    RecentItem(name="Anon T.", datetime_utc="2026-08-01T15:30:00Z", system="tropical"),
    RecentItem(name="Kanya W.", datetime_utc="2026-07-28T11:50:00Z", system="sidereal"),
]


@router.post("/recent", response_model=RecentOut)
async def recent(payload: RecentIn) -> RecentOut:
    # Stub: replace with a real per-user query once chart persistence is wired
    # up (no charts table exists yet — see src/integrations/supabase_client.py).
    limit = max(0, payload.limit)
    return RecentOut(recent=_DEMO_RECENT[:limit])
