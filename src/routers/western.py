"""Western astrology advanced endpoints: progressed charts, solar returns,
and lunar returns.
"""

from fastapi import APIRouter
from pydantic import BaseModel, Field

from src.models.chart import ChartRequest
from src.services.caveat import CAVEAT
from src.services.progressions_service import compute_progressions
from src.services.returns_service import compute_lunar_return, compute_solar_return

router = APIRouter()


class ProgressionRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    date: str = Field(..., description="Birth date YYYY-MM-DD")
    time: str = Field(..., description="Birth time HH:MM:SS")
    target_date: str = Field(..., description="Target date for progression YYYY-MM-DD")
    tz_offset_hours: float = Field(default=7.0, ge=-12, le=14)
    lat: float = Field(default=13.8591, ge=-90, le=90)
    lon: float = Field(default=100.5217, ge=-180, le=180)
    system: str = Field(default="tropical", pattern="^(tropical|sidereal)$")


class SolarReturnRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    date: str = Field(..., description="Birth date YYYY-MM-DD")
    time: str = Field(..., description="Birth time HH:MM:SS")
    target_year: int = Field(..., ge=1900, le=2200)
    tz_offset_hours: float = Field(default=7.0, ge=-12, le=14)
    lat: float = Field(default=13.8591, ge=-90, le=90)
    lon: float = Field(default=100.5217, ge=-180, le=180)
    system: str = Field(default="tropical", pattern="^(tropical|sidereal)$")
    return_lat: float | None = Field(default=None, ge=-90, le=90)
    return_lon: float | None = Field(default=None, ge=-180, le=180)


class LunarReturnRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    date: str = Field(..., description="Birth date YYYY-MM-DD")
    time: str = Field(..., description="Birth time HH:MM:SS")
    target_date: str = Field(..., description="Target date YYYY-MM-DD")
    tz_offset_hours: float = Field(default=7.0, ge=-12, le=14)
    lat: float = Field(default=13.8591, ge=-90, le=90)
    lon: float = Field(default=100.5217, ge=-180, le=180)
    system: str = Field(default="tropical", pattern="^(tropical|sidereal)$")
    return_lat: float | None = Field(default=None, ge=-90, le=90)
    return_lon: float | None = Field(default=None, ge=-180, le=180)


@router.post("/progressions")
async def progressed_chart(req: ProgressionRequest):
    from datetime import date as date_type, time as time_type

    birth_date = date_type.fromisoformat(req.date)
    birth_time = time_type.fromisoformat(req.time)
    target_date = date_type.fromisoformat(req.target_date)

    result = compute_progressions(
        name=req.name,
        birth_date=birth_date,
        birth_time=birth_time,
        target_date=target_date,
        tz_offset_hours=req.tz_offset_hours,
        lat=req.lat,
        lon=req.lon,
        system=req.system,
    )
    return {**result, "caveat": CAVEAT}


@router.post("/solar-return")
async def solar_return(req: SolarReturnRequest):
    from datetime import date as date_type, time as time_type

    birth_date = date_type.fromisoformat(req.date)
    birth_time = time_type.fromisoformat(req.time)

    result = compute_solar_return(
        name=req.name,
        birth_date=birth_date,
        birth_time=birth_time,
        target_year=req.target_year,
        tz_offset_hours=req.tz_offset_hours,
        lat=req.lat,
        lon=req.lon,
        system=req.system,
        return_lat=req.return_lat,
        return_lon=req.return_lon,
    )
    return {**result, "caveat": CAVEAT}


@router.post("/lunar-return")
async def lunar_return(req: LunarReturnRequest):
    from datetime import date as date_type, time as time_type

    birth_date = date_type.fromisoformat(req.date)
    birth_time = time_type.fromisoformat(req.time)
    target_date = date_type.fromisoformat(req.target_date)

    result = compute_lunar_return(
        name=req.name,
        birth_date=birth_date,
        birth_time=birth_time,
        target_date=target_date,
        tz_offset_hours=req.tz_offset_hours,
        lat=req.lat,
        lon=req.lon,
        system=req.system,
        return_lat=req.return_lat,
        return_lon=req.return_lon,
    )
    return {**result, "caveat": CAVEAT}
