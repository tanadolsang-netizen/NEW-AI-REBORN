from fastapi import APIRouter
from src.models.chart import ChartRequest
from src.services.chart_service import compute_chart
from src.services.aspects import compute_cross_aspects
from src.services.caveat import CAVEAT
from src.services.element_service import compute_element_balance
from src.services.composite_service import compute_composite, compute_relationship_score

router = APIRouter()


@router.post("/cross-aspects")
async def cross_aspects(a: ChartRequest, b: ChartRequest):
    chart_a = compute_chart(**a.model_dump())
    chart_b = compute_chart(**b.model_dump())
    return {
        "a": chart_a,
        "b": chart_b,
        "cross_aspects": compute_cross_aspects(chart_a, chart_b),
        "elements_a": compute_element_balance(chart_a),
        "elements_b": compute_element_balance(chart_b),
        "caveat": CAVEAT,
    }


@router.post("/composite")
async def composite(a: ChartRequest, b: ChartRequest):
    chart_a = compute_chart(**a.model_dump())
    chart_b = compute_chart(**b.model_dump())
    comp = compute_composite(chart_a, chart_b)
    return {
        "a": chart_a,
        "b": chart_b,
        "composite": comp,
        "caveat": CAVEAT,
    }


@router.post("/score")
async def score(a: ChartRequest, b: ChartRequest):
    chart_a = compute_chart(**a.model_dump())
    chart_b = compute_chart(**b.model_dump())
    return compute_relationship_score(chart_a, chart_b)
