import { describe, it, expect, beforeEach } from "vitest";
import {
  clearStoredSession,
  getAccessToken,
  getStoredSession,
  isSessionExpired,
  setStoredSession,
} from "@/services/authStorage";
import type { AuthSession } from "@/services/authApi";

function createSession(expiresAt: string): AuthSession {
  return {
    access_token: "token-123",
    token_type: "bearer",
    expires_at: expiresAt,
    account_id: "11111111-1111-1111-1111-111111111111",
    user: {
      id: "af2a103b-1e52-457a-af33-c5b2f9c4e2e3",
      email: "microsaas.farm@gmail.com",
      name: "microsaas.farm",
      role: "USER",
      status: "ACTIVE",
      is_guest: false,
    },
  };
}

describe("authStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("reads a valid stored session and returns access token", () => {
    const session = createSession(new Date(Date.now() + 60_000).toISOString());
    setStoredSession(session);

    expect(getStoredSession()).toEqual(session);
    expect(getAccessToken()).toBe("token-123");
    expect(isSessionExpired(session)).toBe(false);
  });

  it("drops expired sessions when reading", () => {
    const session = createSession(new Date(Date.now() - 60_000).toISOString());
    setStoredSession(session);

    expect(getStoredSession()).toBeNull();
    expect(getAccessToken()).toBeNull();
    expect(localStorage.getItem("auth-session")).toBeNull();
  });

  it("clears invalid stored payloads", () => {
    localStorage.setItem("auth-session", '{"bad":"shape"}');

    expect(getStoredSession()).toBeNull();
    expect(localStorage.getItem("auth-session")).toBeNull();

    clearStoredSession();
    expect(localStorage.getItem("auth-session")).toBeNull();
  });
});
