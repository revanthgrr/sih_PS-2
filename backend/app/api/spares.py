from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from pydantic import BaseModel

from app.db.session import get_db
from app.services.logistics_service import logistics_service

router = APIRouter(prefix="/spares", tags=["Logistics & Spare Parts"])

class ReserveRequest(BaseModel):
    part_id: str
    aircraft_id: str
    quantity: int = 1

@router.get("")
def get_spares(status: Optional[str] = Query(None), db: Session = Depends(get_db)):
    parts = logistics_service.get_inventory(db, status)
    return {
        "total": len(parts),
        "inventory": parts
    }

@router.get("/shortages")
def get_spare_shortages(db: Session = Depends(get_db)):
    shortages = logistics_service.get_shortage_alerts(db)
    return {
        "total_shortages": len(shortages),
        "alerts": shortages
    }

@router.post("/reserve")
def reserve_part(req: ReserveRequest, db: Session = Depends(get_db)):
    try:
        res = logistics_service.reserve_spare(db, req.part_id, req.aircraft_id, req.quantity)
        return res
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
