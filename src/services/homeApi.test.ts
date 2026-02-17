import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { API_BASE } from "@/config/api";
import { setStoredSession } from "@/services/authStorage";
import {
  fetchAllHomeCategories,
  fetchAllHomeCountries,
  fetchHomeCategoriesCached,
  fetchHomeCountriesCached,
  fetchHomeCategoriesPage,
  fetchHomeCountriesPage,
  HOME_CATEGORIES_CACHE_KEY,
  HOME_CATEGORIES_TTL_MS,
  HOME_COUNTRIES_CACHE_KEY,
  HOME_COUNTRIES_TTL_MS,
  type HomeCategoriesResponse,
  type HomeCountriesResponse,
} from "@/services/homeApi";

function buildPayload(data: HomeCategoriesResponse["data"]): HomeCategoriesResponse {
  return {
    data,
    page: {
      next_cursor: null,
      has_more: false,
    },
    meta: {
      total_estimate: data.length,
    },
  };
}

function buildCountriesPayload(data: HomeCountriesResponse["data"]): HomeCountriesResponse {
  return {
    data,
    page: {
      next_cursor: null,
      has_more: false,
    },
    meta: {
      total_estimate: data.length,
    },
  };
}

describe("homeApi", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    localStorage.clear();
    global.fetch = vi.fn() as typeof fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("returns fresh cache without network call", async () => {
    const payload = buildPayload([
      { slug: "art-design", name: "Art & Design", icon: "palette", channels_count: 62800 },
    ]);

    localStorage.setItem(
      HOME_CATEGORIES_CACHE_KEY,
      JSON.stringify({
        cachedAt: Date.now(),
        payload,
      }),
    );

    const result = await fetchHomeCategoriesCached({ limit: 5 });

    expect(result).toEqual(payload);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("evicts expired cache and refetches", async () => {
    const payload = buildPayload([
      { slug: "beauty", name: "Beauty", icon: "sparkles", channels_count: 65200 },
    ]);

    localStorage.setItem(
      HOME_CATEGORIES_CACHE_KEY,
      JSON.stringify({
        cachedAt: Date.now() - HOME_CATEGORIES_TTL_MS - 1,
        payload: buildPayload([
          { slug: "old", name: "Old", icon: "box", channels_count: 1 },
        ]),
      }),
    );

    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(payload), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const result = await fetchHomeCategoriesCached({ limit: 5 });

    expect(result).toEqual(payload);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(`${API_BASE}/v1.0/home/categories?limit=5`);

    const stored = localStorage.getItem(HOME_CATEGORIES_CACHE_KEY);
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored ?? "{}");
    expect(parsed.payload).toEqual(payload);
  });

  it("evicts malformed cache and refetches", async () => {
    const payload = buildPayload([
      { slug: "blogs", name: "Blogs", icon: "file-text", channels_count: 127500 },
    ]);

    localStorage.setItem(HOME_CATEGORIES_CACHE_KEY, "{bad-json");

    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(payload), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const result = await fetchHomeCategoriesCached({ limit: 5 });

    expect(result).toEqual(payload);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(`${API_BASE}/v1.0/home/categories?limit=5`);
    expect(localStorage.getItem(HOME_CATEGORIES_CACHE_KEY)).not.toBeNull();
  });

  it("fetches all pages and deduplicates by slug", async () => {
    vi.mocked(global.fetch)
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            data: [
              { slug: "art-design", name: "Art & Design", icon: "palette", channels_count: 62800 },
              { slug: "beauty", name: "Beauty", icon: "sparkles", channels_count: 65200 },
            ],
            page: {
              next_cursor: "cursor-2",
              has_more: true,
            },
            meta: {
              total_estimate: 3,
            },
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            data: [
              { slug: "beauty", name: "Beauty", icon: "sparkles", channels_count: 65200 },
              { slug: "blogs", name: "Blogs", icon: "file-text", channels_count: 127500 },
            ],
            page: {
              next_cursor: null,
              has_more: false,
            },
            meta: {
              total_estimate: 3,
            },
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
      );

    const result = await fetchAllHomeCategories({ limit: 2 });

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenNthCalledWith(1, `${API_BASE}/v1.0/home/categories?limit=2`);
    expect(global.fetch).toHaveBeenNthCalledWith(
      2,
      `${API_BASE}/v1.0/home/categories?limit=2&cursor=cursor-2`,
    );
    expect(result.data.map((item) => item.slug)).toEqual(["art-design", "beauty", "blogs"]);
    expect(result.page).toEqual({
      next_cursor: null,
      has_more: false,
    });
  });

  it("does not send Authorization header for categories endpoint", async () => {
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

    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify(
          buildPayload([
            { slug: "art-design", name: "Art & Design", icon: "palette", channels_count: 62800 },
          ]),
        ),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );

    await fetchHomeCategoriesPage({ limit: 5 });

    const [, options] = vi.mocked(global.fetch).mock.calls[0];
    expect(options).toBeUndefined();
  });

  it("returns fresh countries cache without network call", async () => {
    const payload = buildCountriesPayload([
      { code: "AF", name: "Afghanistan", flag_emoji: "🇦🇫", channels_count: 10 },
    ]);

    localStorage.setItem(
      HOME_COUNTRIES_CACHE_KEY,
      JSON.stringify({
        cachedAt: Date.now(),
        payload,
      }),
    );

    const result = await fetchHomeCountriesCached({ limit: 5 });

    expect(result).toEqual(payload);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("evicts expired countries cache and refetches", async () => {
    const payload = buildCountriesPayload([
      { code: "DZ", name: "Algeria", flag_emoji: "🇩🇿", channels_count: 8 },
    ]);

    localStorage.setItem(
      HOME_COUNTRIES_CACHE_KEY,
      JSON.stringify({
        cachedAt: Date.now() - HOME_COUNTRIES_TTL_MS - 1,
        payload: buildCountriesPayload([
          { code: "XX", name: "Old", flag_emoji: "🏳️", channels_count: 1 },
        ]),
      }),
    );

    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(payload), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const result = await fetchHomeCountriesCached({ limit: 5 });

    expect(result).toEqual(payload);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(`${API_BASE}/v1.0/home/countries?limit=5`);

    const stored = localStorage.getItem(HOME_COUNTRIES_CACHE_KEY);
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored ?? "{}");
    expect(parsed.payload).toEqual(payload);
  });

  it("evicts malformed countries cache and refetches", async () => {
    const payload = buildCountriesPayload([
      { code: "AR", name: "Argentina", flag_emoji: "🇦🇷", channels_count: 2000 },
    ]);

    localStorage.setItem(HOME_COUNTRIES_CACHE_KEY, "{bad-json");

    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(payload), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const result = await fetchHomeCountriesCached({ limit: 5 });

    expect(result).toEqual(payload);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(`${API_BASE}/v1.0/home/countries?limit=5`);
    expect(localStorage.getItem(HOME_COUNTRIES_CACHE_KEY)).not.toBeNull();
  });

  it("fetches all countries pages and deduplicates by code", async () => {
    vi.mocked(global.fetch)
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            data: [
              { code: "AF", name: "Afghanistan", flag_emoji: "🇦🇫", channels_count: 10 },
              { code: "DZ", name: "Algeria", flag_emoji: "🇩🇿", channels_count: 8 },
            ],
            page: {
              next_cursor: "cursor-2",
              has_more: true,
            },
            meta: {
              total_estimate: 3,
            },
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            data: [
              { code: "DZ", name: "Algeria", flag_emoji: "🇩🇿", channels_count: 8 },
              { code: "AR", name: "Argentina", flag_emoji: "🇦🇷", channels_count: 2000 },
            ],
            page: {
              next_cursor: null,
              has_more: false,
            },
            meta: {
              total_estimate: 3,
            },
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
      );

    const result = await fetchAllHomeCountries({ limit: 2 });

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenNthCalledWith(1, `${API_BASE}/v1.0/home/countries?limit=2`);
    expect(global.fetch).toHaveBeenNthCalledWith(
      2,
      `${API_BASE}/v1.0/home/countries?limit=2&cursor=cursor-2`,
    );
    expect(result.data.map((item) => item.code)).toEqual(["AF", "DZ", "AR"]);
    expect(result.page).toEqual({
      next_cursor: null,
      has_more: false,
    });
  });

  it("does not send Authorization header for countries endpoint", async () => {
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

    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify(
          buildCountriesPayload([
            { code: "AF", name: "Afghanistan", flag_emoji: "🇦🇫", channels_count: 10 },
          ]),
        ),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );

    await fetchHomeCountriesPage({ limit: 5 });

    const [, options] = vi.mocked(global.fetch).mock.calls[0];
    expect(options).toBeUndefined();
  });
});
