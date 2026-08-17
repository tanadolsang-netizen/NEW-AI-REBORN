from fastapi import APIRouter
from src.models.chart import ChartRequest, ChartResponse
from src.services.chart_service import compute_chart

router = APIRouter()


@router.post("/cross-aspects")
async def cross_aspects(a: ChartRequest, b: ChartRequest):
    chart_a = compute_chart(**a.model_dump())
    chart_b = compute_chart(**b.model_dump())
    return {"a": chart_a, "b": chart_b}
