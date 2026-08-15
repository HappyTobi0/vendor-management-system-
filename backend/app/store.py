from datetime import datetime, timezone
from itertools import count
from threading import Lock

from .models import Vendor, VendorCategory, VendorCreate, VendorStatus


class VendorStore:
    """In-memory vendor storage."""

    def __init__(self) -> None:
        self._vendors: dict[int, Vendor] = {}
        self._ids = count(1)
        self._lock = Lock()

    def list(self, category: VendorCategory | None = None) -> list[Vendor]:
        with self._lock:
            vendors = list(self._vendors.values())
        if category is not None:
            vendors = [vendor for vendor in vendors if vendor.category == category]
        return vendors

    def email_exists(self, contact_email: str) -> bool:
        target = contact_email.lower()
        with self._lock:
            return any(v.contact_email.lower() == target for v in self._vendors.values())

    def add(self, payload: VendorCreate) -> Vendor:
        with self._lock:
            vendor = Vendor(
                id=next(self._ids),
                name=payload.name,
                category=payload.category,
                contact_email=payload.contact_email,
                status=VendorStatus.PENDING_APPROVAL,
                created_at=datetime.now(timezone.utc),
            )
            self._vendors[vendor.id] = vendor
            return vendor

    def get(self, vendor_id: int) -> Vendor | None:
        with self._lock:
            return self._vendors.get(vendor_id)

    def approve(self, vendor_id: int) -> Vendor | None:
        with self._lock:
            vendor = self._vendors.get(vendor_id)
            if vendor is None:
                return None
            updated = vendor.model_copy(update={"status": VendorStatus.APPROVED})
            self._vendors[vendor_id] = updated
            return updated

    def clear(self) -> None:
        with self._lock:
            self._vendors.clear()
            self._ids = count(1)


store = VendorStore()
