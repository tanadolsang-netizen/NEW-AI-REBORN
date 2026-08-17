from fastapi import APIRouter
from src.models.chart import ChartRequest, ChartResponse
from src.services.chart_service import compute_chart

router = APIRouter()


@router.post("/compute", response_model=ChartResponse)
async def compute_natal(req: ChartRequest):
    return compute_chart(
        name=req.name,
        date=req.date,
        time=req.time,
        tz_offset_hours=req.tz_offset_hours,
        lat=req.lat,
        lon=req.lon,
        system=req.system,
    )
