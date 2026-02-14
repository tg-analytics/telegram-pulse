import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { API_BASE } from "@/config/api";
import { fetchMiniApps, fetchMiniAppsSummary } from "@/services/miniAppsApi";
import { setStoredSession } from "@/services/authStorage";

describe("miniAppsApi", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    localStorage.clear();
    global.fetch = vi.fn() as typeof fetch;
    vi.mocked(global.fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          data: [],
          page: {
            next_cursor: null,
            has_more: false,
          },
          meta: {
            total_estimate: 0,
          },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("adds Authorization header when auth session exists", async () => {
    setStoredSession({
      access_token: "session-token",
      token_type: "bearer",
      expires_at: new Date(Date.now() + 60_000).toISOString(),
      account_id: "11111111-1111-1111-1111-111111111111",
      user: {
        id: "af2a103b-1e52-457a-af33-c5b2f9c4e2e3",
        email: "microsaas.farm@gmail.com",
        name: "microsaas.farm",
        role: "USER",
        status: "ACTIVE",
        is_guest: false,
      },
    });

    await fetchMiniAppsSummary("7d");

    const [, options] = vi.mocked(global.fetch).mock.calls[0];
    expect(options?.headers).toEqual({
      Authorization: "Bearer session-token",
    });
  });

  it("omits Authorization header when no auth session exists", async () => {
    await fetchMiniAppsSummary("7d");

    const [, options] = vi.mocked(global.fetch).mock.calls[0];
    expect(options?.headers).toEqual({});
  });

  it("serializes summary period", async () => {
    await fetchMiniAppsSummary("30d");

    const [url] = vi.mocked(global.fetch).mock.calls[0];
    expect(url).toBe(`${API_BASE}/v1.0/mini-apps/summary?period=30d`);
  });

  it("serializes list filters, sort and cursor", async () => {
    await fetchMiniApps({
      q: "wallet",
      category_slug: "finance",
      min_daily_users: 100000,
      min_rating: 4.5,
      launch_within_days: 180,
      min_growth: 10,
      sort_by: "growth",
      sort_order: "desc",
      limit: 10,
      cursor: "cursor-1",
    });

    const [url] = vi.mocked(global.fetch).mock.calls[0];
    expect(url).toContain(`${API_BASE}/v1.0/mini-apps?`);
    expect(url).toContain("q=wallet");
    expect(url).toContain("category_slug=finance");
    expect(url).toContain("min_daily_users=100000");
    expect(url).toContain("min_rating=4.5");
    expect(url).toContain("launch_within_days=180");
    expect(url).toContain("min_growth=10");
    expect(url).toContain("sort_by=growth");
    expect(url).toContain("sort_order=desc");
    expect(url).toContain("limit=10");
    expect(url).toContain("cursor=cursor-1");
  });

  it("throws for non-ok response", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ message: "bad" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }),
    );

    await expect(fetchMiniApps()).rejects.toThrow("API error: 500");
  });
});
