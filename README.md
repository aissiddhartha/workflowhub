# WorkFlowHub

![CI](https://github.com/aissiddhartha/workflowhub/actions/workflows/ci.yml/badge.svg)

A minimal workflow and productivity platform built for the SOFT806 CI/CD assignment.
Users can register, log in, and create, edit, delete and move workflow items across a sprint board
(Backlog, Sprint Ready, In Progress, Code Review, QA, Done) by dragging cards between columns.
Each item has a title, an optional description and a priority (Low, Medium, High or Urgent).

## Tech stack
- Backend: Django + Django REST Framework (token authentication)
- Database: PostgreSQL 16
- Frontend: React (Vite)
- Containers: Docker and Docker Compose
- CI: GitHub Actions and CircleCI

## Project structure
- `backend/` Django REST API and its Dockerfile
- `frontend/` React app and its Dockerfile
- `docker-compose.yml` runs the full stack (database, backend, frontend)
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
| POSTGRES_DB | Database name |
| POSTGRES_USER | Database user |
| POSTGRES_PASSWORD | Database password (required by Docker Compose) |
| POSTGRES_HOST | Database host. Docker Compose sets it to `db`; use `localhost` when running Django on your own computer |
| POSTGRES_PORT | Database port, default `5432` |

## Run with Docker Compose
```
copy .env.example .env
docker compose up -d --build
```
Frontend: http://localhost:3000, API: http://localhost:8000/api/

Stop with `docker compose down`. Data is kept in the `postgres_data` volume.
`docker compose down -v` also deletes the data.

## Run locally without Docker
The backend needs PostgreSQL. Start only the database container from the project root:
```
docker compose up -d db
```
Backend (Git Bash shown; in Command Prompt use `set` instead of `export` and `venv\Scripts\activate`):
```
cd backend
python -m venv venv
source venv/Scripts/activate
pip install -r requirements.txt
export POSTGRES_DB=workflowhub POSTGRES_USER=workflowhub POSTGRES_PASSWORD=<your-password> POSTGRES_HOST=localhost
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

## Tests
With the database running and the variables above set, from the `backend` folder:
```
python manage.py test
```
Or through Docker, from the project root:
```
docker compose run --rm --build backend python manage.py test
```

## Database changes
After changing `backend/items/models.py`, run `python manage.py makemigrations` and
`python manage.py migrate`, and commit the new file in `backend/items/migrations/`.

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
Every push and pull request runs in GitHub Actions: it builds both Docker images and runs the backend
unit tests against a PostgreSQL service. CircleCI builds both images. A pull request needs one approval
and passing `build-backend` and `build-frontend` checks before it can be merged.