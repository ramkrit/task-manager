# Task Manager

A simple full-stack application to create and manage tasks.

- **Frontend:** Next.js (App Router) + TypeScript + Tailwind CSS
- **Backend:** NestJS + TypeORM + MongoDB + Swagger
- **Infra:** Docker + Docker Compose

---

## Features

- Create tasks with a title and optional description
- View all tasks, newest first
- Update a task's status: **To Do → In Progress → Done**
- Filter tasks by status
- Delete tasks
- Full REST API documented with Swagger/OpenAPI
- Server-side validation of all inputs

---

## Project Structure

```
task-manager/
├── backend/            # NestJS API (TypeORM + MongoDB + Swagger)
│   └── src/
│       ├── main.ts
│       ├── app.module.ts
│       └── tasks/      # Task module: controller, service, entity, DTOs
├── frontend/           # Next.js app
│   └── src/
│       ├── app/        # Pages (App Router)
│       ├── components/ # TaskForm, TaskItem
│       └── lib/        # API client + types
├── docker-compose.yml
└── README.md
```

---

## Running with Docker (recommended)

From the project root:

```bash
docker compose up --build
```

Then open:

- Frontend: http://localhost:3000
- API: http://localhost:4000/api/v1
- Swagger docs: http://localhost:4000/api/docs

Docker Compose starts three services: MongoDB, the NestJS backend, and the
Next.js frontend, all wired together.

---

## Running locally (without Docker)

You'll need Node.js 20+ and a running MongoDB instance.

### 1. MongoDB

Run a local MongoDB (e.g. via Docker):

```bash
docker run -d -p 27017:27017 --name task-mongo mongo:7
```

### 2. Backend

```bash
cd backend
cp .env.example .env     # adjust values if needed
npm install
npm run start:dev
```

API runs on http://localhost:4000/api/v1 and Swagger on
http://localhost:4000/api/docs.

### 3. Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

App runs on http://localhost:3000.

---

## API Overview

| Method | Endpoint             | Description                        |
| ------ | -------------------- | ---------------------------------- |
| POST   | `/api/v1/tasks`      | Create a task                      |
| GET    | `/api/v1/tasks`      | List tasks (optional `?status=`)   |
| GET    | `/api/v1/tasks/:id`  | Get a single task                  |
| PATCH  | `/api/v1/tasks/:id`  | Update a task                      |
| DELETE | `/api/v1/tasks/:id`  | Delete a task                      |

Task status values: `todo`, `in_progress`, `done`.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable      | Default                                  | Description                 |
| ------------- | ---------------------------------------- | --------------------------- |
| `PORT`        | `4000`                                   | API port                    |
| `MONGODB_URI` | `mongodb://localhost:27017/taskmanager`  | MongoDB connection string   |
| `MONGODB_DB`  | `taskmanager`                            | Database name               |
| `CORS_ORIGIN` | `http://localhost:3000`                  | Allowed frontend origin     |

### Frontend (`frontend/.env.local`)

| Variable              | Default                      | Description          |
| --------------------- | ---------------------------- | -------------------- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000/api/v1` | Base URL of the API |

> Do not commit real `.env` files. They are gitignored. If a connection
> string with credentials is ever exposed, rotate the password.

---

## Design Notes

### Key decisions

1. **Clear frontend/backend separation in a single repo.** The API and UI are
   fully decoupled and communicate over REST. This keeps responsibilities clear,
   lets each side be developed, tested, and deployed independently, and makes
   the system easy to reason about.

2. **A thin, well-validated API with Swagger as living documentation.** Every
   endpoint uses DTOs with `class-validator`, and Swagger is generated from the
   same decorators. This means the docs can never drift from the implementation,
   and invalid payloads are rejected before they reach the database.

3. **Docker Compose for one-command setup.** MongoDB, the backend, and the
   frontend all come up together with `docker compose up --build`. This removes
   "works on my machine" friction and makes the project trivial to run.

### Scope kept intentionally small

1. **User authentication / multi-user accounts.** This is a simple task
   manager, so tasks are global rather than scoped to a logged-in user. Auth
   adds significant surface area (sessions, password handling, guards) that
   isn't needed for the core task-management flow.

2. **Due dates, priorities, and reminders.** These are useful in a real product
   but are enhancements on top of the core create/manage loop. Leaving them out
   keeps the data model and UI focused and uncluttered.

3. **Automated test suite (unit + e2e).** The architecture (service layer,
   DTOs, typed API client) is deliberately test-friendly so tests can be added
   cleanly later.

### Known limitation / next step

**No optimistic UI or robust error recovery.** Right now the UI waits for each
API call to resolve and surfaces errors with a basic banner. A natural next
step is optimistic updates (so status changes and deletes feel instant), retry
logic for transient network failures, and per-item loading/error states so one
failing request doesn't block the rest of the board.
