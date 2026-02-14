import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { API_BASE } from "@/config/api";
import { signinWithGoogle } from "@/services/authApi";

describe("signinWithGoogle", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = vi.fn() as typeof fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("sends id_token and account_id and returns parsed session", async () => {
    const responsePayload = {
      access_token: "jwt-token",
      token_type: "bearer",
      expires_at: "2026-01-15T14:09:53.119669Z",
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

    vi.mocked(global.fetch).mockResolvedValue(
      new Response(JSON.stringify(responsePayload), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const requestPayload = {
      id_token: "google-id-token",
      account_id: "11111111-1111-1111-1111-111111111111",
    };

    const result = await signinWithGoogle(requestPayload);

    expect(global.fetch).toHaveBeenCalledWith(
      `${API_BASE}/v1.0/signin/google`,
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload),
      }),
    );
    expect(result).toEqual(responsePayload);
  });

  it("throws normalized message when backend rejects request", async () => {
    vi.mocked(global.fetch).mockResolvedValue(
      new Response(JSON.stringify({ message: "Invalid Google token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }),
    );

    await expect(
      signinWithGoogle({
        id_token: "bad-token",
        account_id: "11111111-1111-1111-1111-111111111111",
      }),
    ).rejects.toThrow("Invalid Google token");
  });
});
