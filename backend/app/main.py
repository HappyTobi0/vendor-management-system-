from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from .models import Vendor, VendorCategory, VendorCreate
from .store import store

app = FastAPI(title="Vendor Management System", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/vendors", response_model=list[Vendor])
def list_vendors(category: VendorCategory | None = Query(default=None)) -> list[Vendor]:
    return store.list(category)


@app.post("/vendors", response_model=Vendor, status_code=201)
def create_vendor(payload: VendorCreate) -> Vendor:
    if store.email_exists(payload.contact_email):
        raise HTTPException(status_code=409, detail="A vendor with this email already exists")
    return store.add(payload)


@app.post("/vendors/{vendor_id}/approve", response_model=Vendor)
def approve_vendor(vendor_id: int) -> Vendor:
    vendor = store.approve(vendor_id)
    if vendor is None:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return vendor
