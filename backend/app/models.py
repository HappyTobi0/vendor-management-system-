from datetime import datetime
from enum import Enum

from pydantic import BaseModel, EmailStr, Field, field_validator


class VendorCategory(str, Enum):
    STAFFING_AGENCY = "Staffing Agency"
    FREELANCE_PLATFORM = "Freelance Platform"
    CONSULTANT = "Consultant"


class VendorStatus(str, Enum):
    PENDING_APPROVAL = "Pending Approval"
    APPROVED = "Approved"


class VendorCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    category: VendorCategory
    contact_email: EmailStr

    @field_validator("name")
    @classmethod
    def strip_name(cls, value: str) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError("name must not be blank")
        return stripped


class Vendor(BaseModel):
    id: int
    name: str
    category: VendorCategory
    contact_email: EmailStr
    status: VendorStatus = VendorStatus.PENDING_APPROVAL
    created_at: datetime
