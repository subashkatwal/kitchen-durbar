# Kitchen Durbar

Commercial kitchen appliances storefront - **React + TypeScript** frontend, **Django + DRF** backend, **PostgreSQL**, fully dockerized.

```
kitchen-durbar/
  docker-compose.yml            # base services (prod-leaning: gunicorn + nginx)
  docker-compose.override.yml   # auto-merged dev overrides (hot reload on both sides)
  .env / .env.example
  kitchen-durbar-backend/       # Django REST Framework API
  kitchen-durbar-frontend/      # React + TypeScript SPA (Vite)
```

## Quick start (development)

```bash
cp .env.example .env   # already provided with working dev defaults - edit if you like
docker compose up --build
```

`docker-compose.override.yml` is picked up automatically, so this gives you:
- **Backend** - Django dev server with autoreload at http://localhost:8000, source bind-mounted from `kitchen-durbar-backend/`.
- **Frontend** - Vite dev server with hot module reload at **http://localhost:5173**, source bind-mounted from `kitchen-durbar-frontend/`.
- **Database** - Postgres 16 on an internal network, data persisted in the `pg_data` volume.

On first boot the backend entrypoint automatically:
1. waits for Postgres,
2. runs migrations,
3. seeds the product catalog (idempotent),
4. bootstraps a superuser from `DJANGO_SUPERUSER_*` in `.env` (default: `admin@kitchendurbar.com` / `admin12345`).

### Where to look
| What | URL |
|---|---|
| Storefront (dev) | http://localhost:5173 |
| Backend API root | http://localhost:8000/api/v1 |
| Swagger UI (API docs) | http://localhost:8000/api/v1/docs |
| OpenAPI schema | http://localhost:8000/api/v1/schema |
| Django admin | http://localhost:8000/admin/ |

All API routes live under `/api/v1` with **no trailing slash** (e.g. `POST /api/v1/login`, `GET /api/v1/products/<id>`). Django's own `/admin/` site is unaffected - it keeps its own conventions since it isn't part of this API surface.

## Production-like run

Ignore the override file to get gunicorn (backend) behind no dev server, and the frontend built once and served by nginx (which also reverse-proxies `/api/` and `/admin/` to the backend, so the whole app is on one origin):

```bash
docker compose -f docker-compose.yml up --build -d
```

| What | URL |
|---|---|
| App (nginx) | http://localhost:9004 |
| API (via nginx proxy) | http://localhost:9004/api/v1 |
| Django admin (via nginx proxy) | http://localhost:9004/admin/ |

(Port 9004 is set via `FRONTEND_PORT` - change it in `.env` if you like; it defaults to 9004 instead of 80 since 80 is commonly taken by another service on the host.)

Set `DJANGO_DEBUG=0`, a real `DJANGO_SECRET_KEY`, and proper `DJANGO_ALLOWED_HOSTS` / `CORS_ALLOWED_ORIGINS` in `.env` before doing this for real.

## Two admin surfaces, on purpose
- **`/admin` in the React app** - the branded dashboard (Dashboard/Products/Users/Orders) matching the storefront design, backed by the REST API.
- **Django `/admin/`** - the built-in ORM admin, registered for `User`, `Product`, `Order` (with inline order items). Useful for anything the React dashboard doesn't cover, or quick data fixes.

Both require a staff account (`is_staff=True`).

## Key features
- **Auth**: JWT (SimpleJWT), email + password, plus optional **Sign in with Google** (see below). Registration only creates the account - signing in (email/password or Google) is the only thing that actually authenticates a session.
- **Products**: public catalog with search, category filter, and price/name ordering; admin-only create/update/delete.
- **Cart**: client-side only (React state + localStorage) - mirrors a made-to-order storefront where only confirmed orders need to be persisted.
- **Orders**: placed against the live product catalog (server computes pricing/shipping, never trusts the client); staff can update order status; customers see only their own orders.
- **User management**: admins can promote/demote the admin role, activate/deactivate, and delete accounts from the React admin dashboard (`/admin/users`) - an admin can't do any of this to their own account.
- **WhatsApp checkout**: after an order is placed, the confirmation page links out to WhatsApp with a prefilled message - no payment gateway, matching the made-to-order sales flow.

## Setting up Google Sign-In
Google sign-in is fully wired up but ships disabled until you provide real credentials:

1. In [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials), create an **OAuth 2.0 Client ID** (type: *Web application*).
2. Add your frontend origin(s) as **Authorized JavaScript origins** - for local dev: `http://localhost:5173` and `http://localhost:9004`.
3. Copy the generated Client ID into `.env`: set **both** `GOOGLE_CLIENT_ID` and `VITE_GOOGLE_CLIENT_ID` to the same value. (`GOOGLE_CLIENT_SECRET` is stored for future use but isn't required for the current ID-token flow.)
4. Recreate the containers so the new env vars are picked up: `docker compose up -d --build`.

Until then, `POST /api/v1/google` returns `503` and the Login/Register pages show a small placeholder instead of a broken button - nothing else is affected.

## Manual verification
```bash
docker compose config                          # sanity-check the merged compose file
docker compose up --build                       # bring the stack up
curl http://localhost:8000/api/v1/products      # seeded catalog
```
Then in the browser: register → login → browse/search/filter products → add to cart → checkout →
confirm the order shows up under the admin Orders tab (and in `/admin/`) for a staff account.
