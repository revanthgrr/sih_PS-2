"""
JWT Authentication module for Jatayu (AeroReady AI).

Provides:
  - Token creation and validation using python-jose
  - Secure demo credential verification using passlib bcrypt
  - FastAPI dependency for protecting API routes
"""

import logging
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.config import settings

logger = logging.getLogger("jatayu.auth")

# ----------------------------------------------------------------
# Lazy imports — gracefully degrade if packages not yet installed
# ----------------------------------------------------------------
try:
    from jose import JWTError, jwt as _jwt
    _JOSE_AVAILABLE = True
except ImportError:
    _JOSE_AVAILABLE = False
    logger.warning(
        "python-jose not installed. JWT auth will use a DEMO-ONLY fallback. "
        "Run: pip install python-jose[cryptography]"
    )

try:
    import bcrypt
    _BCRYPT_AVAILABLE = True
except ImportError:
    _BCRYPT_AVAILABLE = False
    logger.warning("bcrypt not installed. Falling back to hashlib pbkdf2_hmac.")


# ----------------------------------------------------------------
# Security scheme
# ----------------------------------------------------------------
_bearer = HTTPBearer(auto_error=False)

# Use a deterministic dev-only secret if JWT_SECRET is unset
_EFFECTIVE_SECRET = settings.JWT_SECRET or "jatayu-dev-insecure-secret-do-not-use-in-production"


# ----------------------------------------------------------------
# Password utilities
# ----------------------------------------------------------------

def _hash_password(plain: str) -> str:
    if _BCRYPT_AVAILABLE:
        pw_bytes = plain.encode("utf-8")[:72]
        return bcrypt.hashpw(pw_bytes, bcrypt.gensalt()).decode("utf-8")
    import hashlib, secrets
    salt = secrets.token_hex(16)
    k = hashlib.pbkdf2_hmac("sha256", plain.encode("utf-8"), salt.encode("utf-8"), 100_000).hex()
    return f"pbkdf2:{salt}:{k}"


def _verify_password(plain: str, hashed: str) -> bool:
    """
    Verifies plain password against a bcrypt or pbkdf2 hash.
    Constant-time comparison used throughout.
    """
    if _BCRYPT_AVAILABLE and hashed.startswith(("$2a$", "$2b$", "$2y$")):
        try:
            pw_bytes = plain.encode("utf-8")[:72]
            return bcrypt.checkpw(pw_bytes, hashed.encode("utf-8"))
        except Exception:
            return False
    if hashed.startswith("pbkdf2:"):
        parts = hashed.split(":")
        if len(parts) == 3:
            salt = parts[1]
            k = parts[2]
            import hashlib, hmac
            test_k = hashlib.pbkdf2_hmac("sha256", plain.encode("utf-8"), salt.encode("utf-8"), 100_000).hex()
            return hmac.compare_digest(test_k, k)
    import hashlib, hmac
    plain_hash = hashlib.sha256(plain.encode("utf-8")).hexdigest()
    return hmac.compare_digest(plain_hash, hashed)


# Pre-compute hash of demo password at startup so it's never plaintext at runtime
_DEMO_PASSWORD_HASH: str = _hash_password(settings.DEMO_PASSWORD)


def verify_demo_credentials(username: str, password: str) -> bool:
    """
    Verifies credentials against the configured demo user.
    Passwords are always compared via secure hash — never in plaintext.
    """
    if username != settings.DEMO_USERNAME:
        return False
    return _verify_password(password, _DEMO_PASSWORD_HASH)


# ----------------------------------------------------------------
# Token utilities
# ----------------------------------------------------------------

def create_access_token(username: str) -> str:
    """Creates a signed JWT access token."""
    expire = datetime.now(timezone.utc) + timedelta(hours=settings.JWT_EXPIRE_HOURS)
    payload = {
        "sub": username,
        "exp": expire,
        "iat": datetime.now(timezone.utc),
        "type": "access",
    }

    if _JOSE_AVAILABLE:
        return _jwt.encode(payload, _EFFECTIVE_SECRET, algorithm=settings.JWT_ALGORITHM)

    # Dev fallback: base64-encoded JSON (NOT secure — for local dev only)
    import base64, json
    token_data = json.dumps({**payload, "exp": expire.isoformat()})
    return base64.urlsafe_b64encode(token_data.encode()).decode()


def decode_access_token(token: str) -> Optional[str]:
    """
    Decodes and validates a JWT token.
    Returns the username (sub claim) on success, None on failure.
    """
    try:
        if _JOSE_AVAILABLE:
            payload = _jwt.decode(token, _EFFECTIVE_SECRET, algorithms=[settings.JWT_ALGORITHM])
            return payload.get("sub")

        # Dev fallback decoder
        import base64, json
        decoded = json.loads(base64.urlsafe_b64decode(token.encode()).decode())
        from datetime import datetime as dt
        exp = dt.fromisoformat(decoded.get("exp", ""))
        if dt.now(timezone.utc) > exp.replace(tzinfo=timezone.utc):
            return None  # expired
        return decoded.get("sub")

    except Exception:
        return None


# ----------------------------------------------------------------
# FastAPI dependency
# ----------------------------------------------------------------

def require_auth(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(_bearer),
) -> str:
    """
    FastAPI dependency that enforces JWT authentication.
    Returns the authenticated username if token is valid.
    Raises HTTP 401 if token is missing, invalid, or expired.
    """
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please log in.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    username = decode_access_token(credentials.credentials)
    if username is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token. Please log in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return username
