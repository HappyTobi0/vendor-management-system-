# Vendor Management System

Mini internal tool for an HR/hiring team to register vendors (staffing agencies, freelance
platforms, consultants) and track their approval status. Data is stored in memory — no database.

## Backend (FastAPI)

```bash
cd backend
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
.venv/bin/uvicorn app.main:app --reload --port 8000
```

Endpoints:

| Method | Path                     | Description                                            |
| ------ | ------------------------ | ------------------------------------------------------ |
| GET    | `/vendors`               | List vendors, optional `?category=` filter              |
| POST   | `/vendors`               | Register a vendor (status defaults to Pending Approval) |
| POST   | `/vendors/{id}/approve`  | Set a vendor's status to Approved                       |
| GET    | `/health`                | Health check                                            |

Tests: `.venv/bin/python -m pytest`

## Frontend (React + TypeScript + Vite)

```bash
cd frontend
npm install
npm run dev
```

The API base URL defaults to `http://localhost:8000` and can be overridden with
`VITE_API_BASE_URL`.
