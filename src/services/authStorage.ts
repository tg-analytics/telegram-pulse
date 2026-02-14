import type { AuthSession } from "@/services/authApi";

const AUTH_SESSION_STORAGE_KEY = "auth-session";

function getStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

function isValidSessionShape(value: unknown): value is AuthSession {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<AuthSession>;
  return (
    typeof candidate.access_token === "string" &&
    typeof candidate.token_type === "string" &&
    typeof candidate.expires_at === "string" &&
    typeof candidate.account_id === "string" &&
    !!candidate.user &&
    typeof candidate.user.id === "string" &&
    typeof candidate.user.email === "string" &&
    typeof candidate.user.name === "string" &&
    typeof candidate.user.role === "string" &&
    typeof candidate.user.status === "string" &&
    typeof candidate.user.is_guest === "boolean"
  );
}

export function isSessionExpired(session: Pick<AuthSession, "expires_at">) {
  const expiresAtMs = Date.parse(session.expires_at);
  if (Number.isNaN(expiresAtMs)) {
    return true;
  }

  return expiresAtMs <= Date.now();
}

export function clearStoredSession() {
  const storage = getStorage();
  storage?.removeItem(AUTH_SESSION_STORAGE_KEY);
}

export function setStoredSession(session: AuthSession) {
  const storage = getStorage();
  storage?.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function getStoredSession(): AuthSession | null {
  const storage = getStorage();
  const rawSession = storage?.getItem(AUTH_SESSION_STORAGE_KEY);

  if (!rawSession) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawSession);
    if (!isValidSessionShape(parsed) || isSessionExpired(parsed)) {
      clearStoredSession();
      return null;
    }

    return parsed;
  } catch {
    clearStoredSession();
    return null;
  }
}

export function getAccessToken() {
  return getStoredSession()?.access_token ?? null;
}
