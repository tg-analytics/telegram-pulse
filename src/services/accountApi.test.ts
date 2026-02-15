import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { API_BASE } from "@/config/api";
import { setStoredSession } from "@/services/authStorage";
import {
  addAccountChannel,
  fetchApiUsage,
  fetchAccountChannels,
  fetchInvoices,
  fetchMe,
  fetchMembers,
  removeMember,
  updatePreferences,
} from "@/services/accountApi";

describe("accountApi", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    localStorage.clear();
    global.fetch = vi.fn() as typeof fetch;
    setStoredSession({
      access_token: "session-token",
      token_type: "bearer",
      expires_at: new Date(Date.now() + 60_000).toISOString(),
      account_id: "acc-1",
      user: {
        id: "u-1",
        email: "user@example.com",
        name: "User",
        role: "USER",
        status: "ACTIVE",
        is_guest: false,
      },
    });
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("adds bearer token for /users/me", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          email: "john@example.com",
          first_name: "John",
          last_name: "Doe",
          telegram_username: "@johndoe",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );

    await fetchMe();

    const [url, options] = vi.mocked(global.fetch).mock.calls[0];
    expect(url).toBe(`${API_BASE}/v1.0/users/me`);
    expect(options?.headers).toEqual({
      Authorization: "Bearer session-token",
    });
  });

  it("adds account headers for members endpoint", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ data: [], meta: {} }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    await fetchMembers("acc-1");

    const [url, options] = vi.mocked(global.fetch).mock.calls[0];
    expect(url).toBe(`${API_BASE}/v1.0/accounts/acc-1/members`);
    expect(options?.headers).toEqual({
      Authorization: "Bearer session-token",
      "X-Account-Id": "acc-1",
    });
  });

  it("builds date range query for api usage", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ data: { total_requests: 10, error_rate: 0.1, avg_latency_ms: 10, by_day: [] }, meta: {} }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    await fetchApiUsage("acc-1", "2026-02-01", "2026-02-14");

    const [url] = vi.mocked(global.fetch).mock.calls[0];
    expect(url).toBe(`${API_BASE}/v1.0/accounts/acc-1/api-usage?from=2026-02-01&to=2026-02-14`);
  });

  it("builds cursor query for invoices", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ data: [], page: { next_cursor: null, has_more: false }, meta: {} }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    await fetchInvoices("acc-1", { limit: 20, cursor: "abc" });

    const [url] = vi.mocked(global.fetch).mock.calls[0];
    expect(url).toBe(`${API_BASE}/v1.0/accounts/acc-1/invoices?limit=20&cursor=abc`);
  });

  it("adds account headers for account channels endpoint", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ data: [], page: { next_cursor: null, has_more: false }, meta: {} }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    await fetchAccountChannels("acc-1");

    const [url, options] = vi.mocked(global.fetch).mock.calls[0];
    expect(url).toBe(`${API_BASE}/v1.0/accounts/acc-1/channels?limit=20`);
    expect(options?.headers).toEqual({
      Authorization: "Bearer session-token",
      "X-Account-Id": "acc-1",
    });
  });

  it("builds cursor query for account channels", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ data: [], page: { next_cursor: null, has_more: false }, meta: {} }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    await fetchAccountChannels("acc-1", { limit: 20, cursor: "eyJjdXJzb3IiOiIxIn0=" });

    const [url] = vi.mocked(global.fetch).mock.calls[0];
    expect(url).toBe(
      `${API_BASE}/v1.0/accounts/acc-1/channels?limit=20&cursor=eyJjdXJzb3IiOiIxIn0%3D`,
    );
  });

  it("posts add account channel with account headers and payload", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          data: {
            account_id: "acc-1",
            channel_id: "9f28253d-8ffd-4d2f-a67c-ebaf0f6ba2f2",
            alias_name: "Primary Tech Channel",
            monitoring_enabled: true,
            is_favorite: true,
            added_at: "2026-02-14T12:00:00Z",
          },
          meta: {},
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      ),
    );

    await addAccountChannel("acc-1", {
      channel_id: "9f28253d-8ffd-4d2f-a67c-ebaf0f6ba2f2",
      alias_name: "Primary Tech Channel",
      monitoring_enabled: true,
      is_favorite: true,
    });

    const [url, options] = vi.mocked(global.fetch).mock.calls[0];
    expect(url).toBe(`${API_BASE}/v1.0/accounts/acc-1/channels`);
    expect(options?.method).toBe("POST");
    expect(options?.headers).toEqual({
      Authorization: "Bearer session-token",
      "X-Account-Id": "acc-1",
      "Content-Type": "application/json",
    });
    expect(options?.body).toBe(
      JSON.stringify({
        channel_id: "9f28253d-8ffd-4d2f-a67c-ebaf0f6ba2f2",
        alias_name: "Primary Tech Channel",
        monitoring_enabled: true,
        is_favorite: true,
      }),
    );
  });

  it("surfaces nested error.message payload", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          error: {
            code: "validation_error",
            message: "theme must be one of light,dark,system",
            details: [],
          },
        }),
        {
          status: 422,
          headers: { "Content-Type": "application/json" },
        },
      ),
    );

    await expect(
      updatePreferences({ language_code: "en", timezone: "UTC", theme: "dark" }),
    ).rejects.toThrow("theme must be one of light,dark,system");
  });

  it("handles delete failure errors", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          error: {
            code: "validation_error",
            message: "Account owner cannot be removed.",
            details: [],
          },
        }),
        {
          status: 422,
          headers: { "Content-Type": "application/json" },
        },
      ),
    );

    await expect(removeMember("acc-1", "m-1")).rejects.toThrow("Account owner cannot be removed.");
  });
});
