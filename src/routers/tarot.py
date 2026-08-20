from fastapi import APIRouter, HTTPException

from src.models.tarot import TarotDrawRequest, TarotDrawResponse
from src.services.caveat import CAVEAT
from src.services.chart_service import compute_chart
from src.services.element_service import compute_element_balance
from src.services.tarot_service import draw_spread

router = APIRouter()


@router.post("/draw", response_model=TarotDrawResponse)
async def draw(req: TarotDrawRequest):
    balance = None
    if req.birth is not None:
        chart = compute_chart(
            name=req.name,
            date=req.birth.date,
            time=req.birth.time,
            tz_offset_hours=req.birth.tz_offset_hours,
            lat=req.birth.lat,
            lon=req.birth.lon,
            system=req.birth.system,
        )
        balance = compute_element_balance(chart)

    try:
        result = draw_spread(
            name=req.name,
            spread=req.spread,
            seed=req.seed,
            element_balance=balance,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return {**result, "elements": balance, "caveat": CAVEAT}
