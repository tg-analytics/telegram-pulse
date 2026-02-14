import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchChannels } from "@/services/channelsApi";
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
