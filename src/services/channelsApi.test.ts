import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { API_BASE } from "@/config/api";
import { fetchChannelOverview, fetchChannels } from "@/services/channelsApi";
import { setStoredSession } from "@/services/authStorage";

describe("fetchChannels", () => {
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

    await fetchChannels();

    const [, options] = vi.mocked(global.fetch).mock.calls[0];
    expect(options?.headers).toEqual({
      Authorization: "Bearer session-token",
    });
  });

  it("omits Authorization header when no auth session exists", async () => {
    await fetchChannels();

    const [, options] = vi.mocked(global.fetch).mock.calls[0];
    expect(options?.headers).toEqual({});
  });
});

describe("fetchChannelOverview", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    localStorage.clear();
    global.fetch = vi.fn() as typeof fetch;
    vi.mocked(global.fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          data: {
            channel: {
              channel_id: "9f28253d-8ffd-4d2f-a67c-ebaf0f6ba2f2",
              telegram_channel_id: 100001,
              name: "Tech News Daily",
              username: "@technewsdaily",
              avatar_url: null,
              description: null,
              about_text: null,
              website_url: null,
              status: "verified",
              country_code: "US",
              category_slug: "technology",
              category_name: "Technology",
            },
            kpis: {
              subscribers: { value: 5430000, delta: 156000, delta_percent: 2.96 },
              avg_views: { value: 1780000, delta: 42000, delta_percent: 2.42 },
              engagement_rate: { value: 3.2, delta: 0.3, delta_percent: 10.34 },
              posts_per_day: { value: 4.2, delta: -0.5, delta_percent: -10.64 },
            },
            chart: { range: "30d", points: [] },
            similar_channels: [],
            tags: [],
            recent_posts: [],
            inout_30d: { incoming: 12500, outgoing: 3200 },
          },
          meta: {},
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

    await fetchChannelOverview("9f28253d-8ffd-4d2f-a67c-ebaf0f6ba2f2");

    const [url, options] = vi.mocked(global.fetch).mock.calls[0];
    expect(url).toBe(`${API_BASE}/v1.0/channels/9f28253d-8ffd-4d2f-a67c-ebaf0f6ba2f2/overview`);
    expect(options?.headers).toEqual({
      Authorization: "Bearer session-token",
    });
  });

  it("omits Authorization header when no auth session exists", async () => {
    await fetchChannelOverview("9f28253d-8ffd-4d2f-a67c-ebaf0f6ba2f2");

    const [, options] = vi.mocked(global.fetch).mock.calls[0];
    expect(options?.headers).toEqual({});
  });

  it("throws for non-ok response", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ message: "bad" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }),
    );

    await expect(fetchChannelOverview("9f28253d-8ffd-4d2f-a67c-ebaf0f6ba2f2")).rejects.toThrow("API error: 500");
  });
});
