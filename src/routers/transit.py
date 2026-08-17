from fastapi import APIRouter
from src.services.transit_service import compute_now

router = APIRouter()


@router.get("/now")
async def transit_now(lat: float = 13.8591, lon: float = 100.5217, tz: float = 7.0):
    return compute_now(lat=lat, lon=lon, tz_offset_hours=tz)
