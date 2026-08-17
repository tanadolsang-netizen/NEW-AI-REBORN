from fastapi import APIRouter, Depends, HTTPException
from src.integrations.stripe_client import create_checkout_session, StripeCheckoutRequest, StripeCheckoutResponse

router = APIRouter()


@router.post("/checkout", response_model=StripeCheckoutResponse)
async def checkout(req: StripeCheckoutRequest):
    return await create_checkout_session(req)
