# Deploying to EC2 with Docker

This guide deploys the Task Manager to an EC2 instance that already has Docker
and Docker Compose installed and running.

> **Important:** The `.env` files are **not** in the repository (they are
> gitignored). You will create them on the server. The values must point to your
> EC2 public address, **not** `localhost`, because the frontend runs in the
> user's browser.

---

## 1. Open the required ports in the EC2 Security Group

In the AWS console, edit the instance's Security Group inbound rules to allow:

| Port | Purpose           | Source      |
| ---- | ----------------- | ----------- |
| 22   | SSH               | Your IP     |
| 3000 | Frontend (web UI) | 0.0.0.0/0   |
| 4000 | Backend API       | 0.0.0.0/0   |

You do **not** need to expose 27017 (MongoDB) publicly.

---

## 2. SSH into the instance and clone the repo

```bash
ssh -i your-key.pem ec2-user@<EC2_PUBLIC_IP>

git clone https://github.com/ramkrit/task-manager.git
cd task-manager
```

---

## 3. Create the environment files on the server

Replace `<EC2_PUBLIC_IP>` with your instance's public IPv4 address (or domain).

### Root `.env` (used for the frontend build arg)

```bash
cat > .env <<EOF
NEXT_PUBLIC_API_URL=http://<EC2_PUBLIC_IP>:4000/api
EOF
```

### `frontend/.env`

```bash
cat > frontend/.env <<EOF
NEXT_PUBLIC_API_URL=http://<EC2_PUBLIC_IP>:4000/api
EOF
```

### `backend/.env`

Choose **one** database option.

**Option A — use the bundled MongoDB container (recommended, self-contained):**

```bash
cat > backend/.env <<EOF
PORT=4000
MONGODB_URI=mongodb://mongo:27017/taskmanager
MONGODB_DB=taskmanager
CORS_ORIGIN=http://<EC2_PUBLIC_IP>:3000
EOF
```

**Option B — use MongoDB Atlas (managed):**

```bash
cat > backend/.env <<EOF
PORT=4000
MONGODB_URI=<your-atlas-connection-string>
MONGODB_DB=taskmanager
CORS_ORIGIN=http://<EC2_PUBLIC_IP>:3000
EOF
```

> If you use Atlas, add the EC2 instance's public IP to the Atlas Network
> Access allowlist, or the connection will time out.

---

## 4. Build and start the stack

```bash
docker compose up --build -d
```

`-d` runs it detached (in the background).

Check everything is up:

```bash
docker compose ps
docker compose logs -f backend   # Ctrl+C to stop following
```

---

## 5. Open the app

- Frontend: `http://<EC2_PUBLIC_IP>:3000`
- API:      `http://<EC2_PUBLIC_IP>:4000/api`
- Swagger:  `http://<EC2_PUBLIC_IP>:4000/api/docs`

---

## Managing the deployment

```bash
# Stop
docker compose down

# Stop and wipe the database volume
docker compose down -v

# Rebuild after pulling new code
git pull
docker compose up --build -d

# View logs
docker compose logs -f
```

---

## Troubleshooting

- **Frontend loads but tasks never appear / network errors in the browser
  console:** `NEXT_PUBLIC_API_URL` is wrong. It is baked at build time, so after
  changing `.env` / `frontend/.env` you must rebuild:
  `docker compose up --build -d frontend`.
- **CORS errors in the browser console:** `CORS_ORIGIN` in `backend/.env` must
  exactly match the URL you open in the browser (scheme + host + port), e.g.
  `http://<EC2_PUBLIC_IP>:3000`. Restart the backend after changing it.
- **Backend can't reach the database:** with Option A, confirm the `mongo`
  container is healthy (`docker compose ps`). With Option B, confirm the EC2 IP
  is allowlisted in Atlas.
