# Project Jatayu — Production Readiness Checklist & Deployment Guide

**Target Environment:** Production / Defence Staging  
**Application:** Jatayu AI  

---

## 1. Production Readiness Checklist

| Category | Item | Verification | Status |
|---|---|---|---|
| **Security** | CORS wildcard `"*"` eliminated; strict origin whitelist active | Verified in `config.py` & `main.py` | ✅ Ready |
| **Security** | Security headers injected (`nosniff`, `DENY`, `strict-origin`) | Verified via `test_security_headers` | ✅ Ready |
| **Security** | Sensitive stack traces and raw exceptions hidden from client responses | Verified in `global_exception_handler` | ✅ Ready |
| **Security** | In-memory rate limiting applied across inference & compute routes | Verified in `rate_limiter.py` | ✅ Ready |
| **Security** | Input validation on all query parameters and path parameters | Verified via Pydantic & Regex | ✅ Ready |
| **Security** | Sensitive artifacts (`.env`, `*.db`, `*.pkl`) excluded from version control | Verified in `.gitignore` | ✅ Ready |
| **Auth** | Bearer JWT authentication enforced on all operational REST endpoints | Verified via `test_auth_required` | ✅ Ready |
| **Auth** | Passwords hashed using standard `bcrypt` with constant-time comparison | Verified in `app/auth.py` | ✅ Ready |
| **Auth** | Demo auth credentials configurable via environment variables | Verified via `config.py` | ✅ Ready |
| **Frontend** | React ErrorBoundary wrapped around all application views | Verified in `App.tsx` | ✅ Ready |
| **Frontend** | Empty states implemented for zero-result query returns | Verified in all page components | ✅ Ready |
| **Frontend** | API failure states display clear user-facing retry components | Verified via `ApiError.tsx` | ✅ Ready |
| **Frontend** | Success feedback toast notifications on asynchronous actions | Verified via `Toast.tsx` | ✅ Ready |
| **Frontend** | Dynamic page titles updated per active view | Verified via `usePageTitle` in `App.tsx` | ✅ Ready |
| **Frontend** | Production bundle compiles cleanly (`tsc -b && vite build`) | Verified: zero errors | ✅ Ready |
| **SEO** | Meta description, OpenGraph tags, and canonical links injected | Verified in `index.html` | ✅ Ready |
| **Mobile** | Responsive navigation drawer with overlay backdrop for mobile screens | Verified in `Sidebar.tsx` & `Header.tsx` | ✅ Ready |
| **Mobile** | Tables wrapped in responsive horizontal scrolling containers | Verified across all tables | ✅ Ready |

---

## 2. Production Environment Variables Reference

| Variable | Type | Default (Dev) | Description | Required in Production |
|---|---|---|---|---|
| `PRODUCTION_MODE` | Boolean | `false` | When `true`, disables `/docs` and `/redoc`, enforces strict CORS, enables HSTS header, and enforces non-empty secrets | **Yes** (`true`) |
| `JWT_SECRET` | String | *Empty in dev* | Secret signing key for JWT tokens. Generate with `python -c "import secrets; print(secrets.token_hex(32))"` | **Yes** |
| `JWT_ALGORITHM` | String | `HS256` | Token signing algorithm | Optional |
| `JWT_EXPIRE_HOURS` | Integer | `8` | Token time-to-live | Optional |
| `DEMO_USERNAME` | String | `demo` | Officer username for operational login | **Yes** |
| `DEMO_PASSWORD` | String | `demo` | Secure password for operational login | **Yes** |
| `CORS_ALLOWED_ORIGINS`| String | *Localhost in dev* | Comma-separated list of allowed frontend origins (e.g. `https://jatayu.defence.gov.in`) | **Yes** |
| `DATABASE_URL` | String | SQLite local file | SQLAlchemy database connection string (e.g., PostgreSQL URI) | **Yes** |
| `API_HOST` | String | `0.0.0.0` | Bind host address | Optional |
| `API_PORT` | Integer | `8000` | Bind port number | Optional |

---

## 3. Production Deployment Instructions

### 3.1 Backend Deployment (FastAPI + Uvicorn + Gunicorn)
1. Install production dependencies:
   ```bash
   pip install -r backend/requirements.txt gunicorn
   ```
2. Set production environment variables in your environment or secret manager:
   ```bash
   export PRODUCTION_MODE=true
   export JWT_SECRET="your-high-entropy-64-character-hex-secret"
   export DEMO_USERNAME="command_officer"
   export DEMO_PASSWORD="YourStrongOperationalPassword123!"
   export CORS_ALLOWED_ORIGINS="https://your-domain.gov.in"
   export DATABASE_URL="postgresql://user:pass@db-cluster.internal:5432/jatayu"
   ```
3. Run with Gunicorn process manager:
   ```bash
   gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
   ```

### 3.2 Frontend Deployment (Static Build + Nginx/Caddy)
1. Build optimized production bundle:
   ```bash
   cd frontend
   npm run build
   ```
2. Serve the generated `frontend/dist/` directory using Nginx or Caddy with SPA fallback routing:
   ```nginx
   server {
       listen 80;
       server_name your-domain.gov.in;
       root /var/www/jatayu/dist;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       location /api/ {
           proxy_pass http://127.0.0.1:8000/api/;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```
