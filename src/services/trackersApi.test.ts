import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { API_BASE } from "@/config/api";
import {
  createTracker,
  deleteTracker,
  fetchTracker,
  fetchTrackerMentions,
  fetchTrackers,
  updateTracker,
} from "@/services/trackersApi";
import { setStoredSession } from "@/services/authStorage";

describe("trackersApi", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    localStorage.clear();
    global.fetch = vi.fn() as typeof fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("fetches trackers with base endpoint and account headers", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ data: [], meta: {} }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    setStoredSession({
      access_token: "session-token",
      token_type: "bearer",
      expires_at: new Date(Date.now() + 60_000).toISOString(),
      account_id: "11111111-1111-1111-1111-111111111111",
      user: {
        id: "u-1",
        email: "user@example.com",
        name: "User",
        role: "USER",
        status: "ACTIVE",
        is_guest: false,
      },
    });

    await fetchTrackers("11111111-1111-1111-1111-111111111111");

    const [url, options] = vi.mocked(global.fetch).mock.calls[0];
    expect(url).toBe(`${API_BASE}/v1.0/accounts/11111111-1111-1111-1111-111111111111/trackers`);
    expect(options?.headers).toEqual({
      Authorization: "Bearer session-token",
      "X-Account-Id": "11111111-1111-1111-1111-111111111111",
    });
  });

  it("fetches trackers with filters", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ data: [], meta: {} }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    await fetchTrackers("acc-1", { status: "active", type: "keyword" });

    const [url] = vi.mocked(global.fetch).mock.calls[0];
    expect(url).toContain(`${API_BASE}/v1.0/accounts/acc-1/trackers?`);
    expect(url).toContain("status=active");
    expect(url).toContain("type=keyword");
  });

  it("creates tracker and serializes payload", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ data: { tracker_id: "t-1" }, meta: {} }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    await createTracker("acc-1", {
      tracker_type: "keyword",
      tracker_value: "bitcoin price",
      notify_push: true,
      notify_telegram: true,
      notify_email: false,
    });

    const [url, options] = vi.mocked(global.fetch).mock.calls[0];
    expect(url).toBe(`${API_BASE}/v1.0/accounts/acc-1/trackers`);
    expect(options?.method).toBe("POST");
    expect(options?.body).toBe(
      JSON.stringify({
        tracker_type: "keyword",
        tracker_value: "bitcoin price",
        notify_push: true,
        notify_telegram: true,
        notify_email: false,
      }),
    );
  });

  it("surfaces duplicate create error detail", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ detail: "Tracker already exists for this account." }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      }),
    );

    await expect(
      createTracker("acc-1", {
        tracker_type: "keyword",
        tracker_value: "bitcoin price",
        notify_push: true,
        notify_telegram: true,
        notify_email: false,
      }),
    ).rejects.toThrow("Tracker already exists for this account.");
  });

  it("updates tracker status and handles forbidden errors", async () => {
    vi.mocked(global.fetch)
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ data: { tracker_id: "t-1", status: "paused" }, meta: {} }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ detail: "Insufficient permissions to update tracker." }), {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }),
      );

    await updateTracker("acc-1", "t-1", { status: "paused" });

    const [url, options] = vi.mocked(global.fetch).mock.calls[0];
    expect(url).toBe(`${API_BASE}/v1.0/accounts/acc-1/trackers/t-1`);
    expect(options?.method).toBe("PATCH");
    expect(options?.body).toBe(JSON.stringify({ status: "paused" }));

    await expect(updateTracker("acc-1", "t-1", { status: "active" })).rejects.toThrow(
      "Insufficient permissions to update tracker.",
    );
  });

  it("fetches tracker by id and surfaces not-found errors", async () => {
    vi.mocked(global.fetch)
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            data: { tracker_id: "t-1" },
            meta: {},
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        ),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ detail: "Tracker not found." }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }),
      );

    await expect(fetchTracker("acc-1", "t-1")).resolves.toEqual({
      data: { tracker_id: "t-1" },
      meta: {},
    });

    const [url, options] = vi.mocked(global.fetch).mock.calls[0];
    expect(url).toBe(`${API_BASE}/v1.0/accounts/acc-1/trackers/t-1`);
    expect(options?.method).toBeUndefined();

    await expect(fetchTracker("acc-1", "missing")).rejects.toThrow("Tracker not found.");
  });

  it("deletes tracker and handles not-found errors", async () => {
    vi.mocked(global.fetch)
      .mockResolvedValueOnce(new Response(null, { status: 204 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ detail: "Tracker not found." }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }),
      );

    await expect(deleteTracker("acc-1", "t-1")).resolves.toBeUndefined();
    await expect(deleteTracker("acc-1", "t-1")).rejects.toThrow("Tracker not found.");
  });

  it("fetches mentions with cursor and filters", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          data: [],
          page: { next_cursor: null, has_more: false },
          meta: {},
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      ),
    );

    await fetchTrackerMentions("acc-1", {
      tracker_id: "t-1",
      since: "2026-02-14T00:00:00Z",
      until: "2026-02-14T23:59:59Z",
      limit: 50,
      cursor: "cursor-1",
    });

    const [url] = vi.mocked(global.fetch).mock.calls[0];
    expect(url).toContain(`${API_BASE}/v1.0/accounts/acc-1/tracker-mentions?`);
    expect(url).toContain("tracker_id=t-1");
    expect(url).toContain("since=2026-02-14T00%3A00%3A00Z");
    expect(url).toContain("until=2026-02-14T23%3A59%3A59Z");
    expect(url).toContain("limit=50");
    expect(url).toContain("cursor=cursor-1");
  });
});
