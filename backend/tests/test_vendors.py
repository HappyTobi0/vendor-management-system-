import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.store import store


@pytest.fixture(autouse=True)
def clean_store():
    store.clear()
    yield
    store.clear()


client = TestClient(app)


def create(name="Acme Staffing", category="Staffing Agency", email="hi@acme.com"):
    return client.post(
        "/vendors",
        json={"name": name, "category": category, "contact_email": email},
    )


def test_create_and_list_vendor():
    response = create()
    assert response.status_code == 201
    body = response.json()
    assert body["status"] == "Pending Approval"
    assert body["id"] == 1

    listed = client.get("/vendors").json()
    assert [v["name"] for v in listed] == ["Acme Staffing"]


def test_rejects_invalid_email_and_blank_name():
    assert create(email="not-an-email").status_code == 422
    assert create(name="   ").status_code == 422


def test_rejects_unknown_category():
    assert create(category="Bank").status_code == 422


def test_rejects_duplicate_email():
    assert create().status_code == 201
    assert create(name="Other", email="HI@acme.com").status_code == 409


def test_filter_by_category():
    create(name="A", email="a@x.com", category="Consultant")
    create(name="B", email="b@x.com", category="Freelance Platform")

    consultants = client.get("/vendors", params={"category": "Consultant"}).json()
    assert [v["name"] for v in consultants] == ["A"]


def test_approve_vendor():
    vendor_id = create().json()["id"]
    approved = client.post(f"/vendors/{vendor_id}/approve")
    assert approved.status_code == 200
    assert approved.json()["status"] == "Approved"
    assert client.post("/vendors/999/approve").status_code == 404
