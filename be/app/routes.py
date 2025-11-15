from fastapi import APIRouter, Depends
from .services import CounterService

router = APIRouter()

@router.get("/count")
def get_count(counter: CounterService = Depends()):
    return {"counter": counter.increment()}
