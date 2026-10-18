from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.services.maintenance_service import maintenance_service
from app.services.optimization_service import optimization_service

router = APIRouter(prefix="/maintenance", tags=["Maintenance Planning & Optimization"])

@router.get("/queue")
def get_maintenance_queue_endpoint(db: Session = Depends(get_db)):
    queue = maintenance_service.get_maintenance_queue(db)
    return {
        "total_queued": len(queue),
        "tasks": queue
    }

@router.get("/recommendations")
def get_recommendations_endpoint(db: Session = Depends(get_db)):
    recs = maintenance_service.get_recommendations(db)
    return {
        "total": len(recs),
        "recommendations": recs
    }

@router.get("/schedule")
def get_schedule_endpoint(db: Session = Depends(get_db)):
    queue = maintenance_service.get_maintenance_queue(db)
    return {
        "schedule": queue
    }

@router.post("/optimize")
def optimize_schedule_endpoint(db: Session = Depends(get_db)):
    result = optimization_service.optimize_maintenance_schedule(db)
    return result
