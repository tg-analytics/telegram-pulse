import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { API_BASE } from "@/config/api";
import {
  fetchAdvertiserDetail,
  fetchAdvertisers,
  fetchAdvertisersSummary,
} from "@/services/advertisersApi";
import { setStoredSession } from "@/services/authStorage";

describe("advertisersApi", () => {
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
            time_period_days: 30,
            snapshot_date: "2026-02-14",
            baseline_date: "2026-01-15",
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

    await fetchAdvertisersSummary(30);

    const [, options] = vi.mocked(global.fetch).mock.calls[0];
    expect(options?.headers).toEqual({
      Authorization: "Bearer session-token",
    });
  });

  it("omits Authorization header when no auth session exists", async () => {
    await fetchAdvertisers();

    const [, options] = vi.mocked(global.fetch).mock.calls[0];
    expect(options?.headers).toEqual({});
  });

  it("applies default list params", async () => {
    await fetchAdvertisers();

    const [url] = vi.mocked(global.fetch).mock.calls[0];
    expect(url).toBe(
      `${API_BASE}/v1.0/advertisers?time_period_days=30&sort_by=estimated_spend&sort_order=desc&limit=20`,
    );
  });

  it("serializes list filters and cursor", async () => {
    await fetchAdvertisers({
      q: "binance",
      industry_slug: "crypto",
      time_period_days: 90,
      min_spend: 500000,
      min_channels: 100,
      min_engagement: 3,
      activity_status: "active",
      sort_by: "trend",
      sort_order: "desc",
      limit: 10,
      cursor: "cursor-1",
    });

    const [url] = vi.mocked(global.fetch).mock.calls[0];
    expect(url).toContain(`${API_BASE}/v1.0/advertisers?`);
    expect(url).toContain("q=binance");
    expect(url).toContain("industry_slug=crypto");
    expect(url).toContain("time_period_days=90");
    expect(url).toContain("min_spend=500000");
    expect(url).toContain("min_channels=100");
    expect(url).toContain("min_engagement=3");
    expect(url).toContain("activity_status=active");
    expect(url).toContain("sort_by=trend");
    expect(url).toContain("sort_order=desc");
    expect(url).toContain("limit=10");
    expect(url).toContain("cursor=cursor-1");
  });

  it("serializes summary period", async () => {
    await fetchAdvertisersSummary(30);

    const [url] = vi.mocked(global.fetch).mock.calls[0];
    expect(url).toBe(`${API_BASE}/v1.0/advertisers/summary?time_period_days=30`);
  });

  it("uses advertiser detail endpoint", async () => {
    await fetchAdvertiserDetail("2e63db9e-13f7-4204-b8b6-a394f40ca83a");

    const [url] = vi.mocked(global.fetch).mock.calls[0];
    expect(url).toBe(`${API_BASE}/v1.0/advertisers/2e63db9e-13f7-4204-b8b6-a394f40ca83a`);
  });

  it("throws for non-ok responses", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ message: "bad" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }),
    );

    await expect(fetchAdvertisers()).rejects.toThrow("API error: 500");
  });
});
