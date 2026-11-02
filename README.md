# WorkFlowHub
![CI](https://github.com/aissiddhartha/workflowhub/actions/workflows/ci.yml/badge.svg)

A minimal workflow and productivity platform built for the SOFT806 CI/CD assignment.
Users can register, log in, and create, edit, delete and move workflow items across a sprint board
(Backlog, Sprint Ready, In Progress, Code Review, QA, Done) by dragging cards between columns.
Each item has a title, an optional description and a priority (Low, Medium, High or Urgent).

## Tech stack
- Backend: Django + Django REST Framework (token authentication), SQLite
- Frontend: React (Vite)
- Containers: Docker and Docker Compose
- CI: GitHub Actions and CircleCI

## Project structure
- `backend/` Django REST API and its Dockerfile
- `frontend/` React app and its Dockerfile
- `docker-compose.yml` runs the full stack
- `.github/workflows/ci.yml` GitHub Actions pipeline
- `.circleci/config.yml` CircleCI pipeline

## Prerequisites
Git, Python 3.12, Node.js 20+, Docker Desktop.

## Configuration
Copy `.env.example` to `.env` and adjust the values. `.env` is never committed.

| Variable | Purpose |
|---|---|
| DJANGO_SECRET_KEY | Django secret key |
| DJANGO_DEBUG | `True` or `False` |
| DJANGO_ALLOWED_HOSTS | Comma-separated hosts |
| CORS_ALLOWED_ORIGINS | Comma-separated frontend origins |
| VITE_API_URL | API address used by the frontend |

## Run with Docker Compose
```
copy .env.example .env
docker compose up --build
```
Frontend: http://localhost:3000, API: http://localhost:8000/api/

## Run locally without Docker
Backend:
```
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
Frontend (second terminal):
```
cd frontend
npm install
npm run dev
```
Frontend: http://localhost:5173

## API endpoints
| Method | Path | Description |
|---|---|---|
| POST | /api/auth/register/ | Register with username, unique email and a strong password; returns a token |
| POST | /api/auth/login/ | Log in, returns a token |
| POST | /api/auth/logout/ | Log out (needs token) |
| GET, POST | /api/workflow-items/ | List and create items |
| GET, PUT, PATCH, DELETE | /api/workflow-items/{id}/ | Retrieve, update, delete an item |

Authenticated requests send the header `Authorization: Token <token>`.

A workflow item has these fields: `title`, `description`, `status` (one of `Backlog`, `Sprint Ready`,
`In Progress`, `Code Review`, `QA`, `Done`), and `priority` (one of `Low`, `Medium`, `High`, `Urgent`; default `Medium`).
Users only ever see their own items.

## Branching and CI
Work is done on `feature/*` branches and merged to `main` through reviewed pull requests.
Every push and pull request builds both Docker images in GitHub Actions and CircleCI.
