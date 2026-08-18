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


@router.post("/recent", response_model=RecentOut)
async def recent(payload: RecentIn) -> RecentOut:
    # Stub: replace with real database query once persistence is wired.
    return RecentOut(
        recent=[
            RecentItem(
                name="Demo Chart",
                datetime_utc="2026-01-01T00:00:00Z",
                system="tropical",
            )
        ]
        * payload.limit
    )
