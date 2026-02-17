import { API_BASE } from "@/config/api";

export interface HomeCategory {
  slug: string;
  name: string;
  icon: string;
  channels_count: number;
}

export interface HomeCategoriesResponse {
  data: HomeCategory[];
  page: {
    next_cursor: string | null;
    has_more: boolean;
  };
  meta: {
    total_estimate?: number;
  };
}

export interface HomeCountry {
  code: string;
  name: string;
  flag_emoji: string;
  channels_count: number;
}

export interface HomeCountriesResponse {
  data: HomeCountry[];
  page: {
    next_cursor: string | null;
    has_more: boolean;
  };
  meta: {
    total_estimate?: number;
  };
}

interface HomeCategoriesCacheEntry {
  cachedAt: number;
  payload: HomeCategoriesResponse;
}

interface HomeCountriesCacheEntry {
  cachedAt: number;
  payload: HomeCountriesResponse;
}

export const HOME_CATEGORIES_CACHE_KEY = "home-categories-cache-v1";
export const HOME_CATEGORIES_TTL_MS = 24 * 60 * 60 * 1000;
export const HOME_COUNTRIES_CACHE_KEY = "home-countries-cache-v1";
export const HOME_COUNTRIES_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const DEFAULT_LIMIT = 50;

function getStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object";
}

function isHomeCategory(value: unknown): value is HomeCategory {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.slug === "string" &&
    typeof value.name === "string" &&
    typeof value.icon === "string" &&
    typeof value.channels_count === "number" &&
    Number.isFinite(value.channels_count)
  );
}

function isHomeCategoriesResponse(value: unknown): value is HomeCategoriesResponse {
  if (!isRecord(value)) {
    return false;
  }

  if (!Array.isArray(value.data) || !value.data.every(isHomeCategory)) {
    return false;
  }

  if (!isRecord(value.page)) {
    return false;
  }

  if (typeof value.page.has_more !== "boolean") {
    return false;
  }

  if (!(typeof value.page.next_cursor === "string" || value.page.next_cursor === null)) {
    return false;
  }

  if (!isRecord(value.meta)) {
    return false;
  }

  if (
    value.meta.total_estimate !== undefined &&
    typeof value.meta.total_estimate !== "number"
  ) {
    return false;
  }

  return true;
}

function isHomeCategoriesCacheEntry(value: unknown): value is HomeCategoriesCacheEntry {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.cachedAt === "number" &&
    Number.isFinite(value.cachedAt) &&
    isHomeCategoriesResponse(value.payload)
  );
}

function isHomeCountry(value: unknown): value is HomeCountry {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.code === "string" &&
    typeof value.name === "string" &&
    typeof value.flag_emoji === "string" &&
    typeof value.channels_count === "number" &&
    Number.isFinite(value.channels_count)
  );
}

function isHomeCountriesResponse(value: unknown): value is HomeCountriesResponse {
  if (!isRecord(value)) {
    return false;
  }

  if (!Array.isArray(value.data) || !value.data.every(isHomeCountry)) {
    return false;
  }

  if (!isRecord(value.page)) {
    return false;
  }

  if (typeof value.page.has_more !== "boolean") {
    return false;
  }

  if (!(typeof value.page.next_cursor === "string" || value.page.next_cursor === null)) {
    return false;
  }

  if (!isRecord(value.meta)) {
    return false;
  }

  if (
    value.meta.total_estimate !== undefined &&
    typeof value.meta.total_estimate !== "number"
  ) {
    return false;
  }

  return true;
}

function isHomeCountriesCacheEntry(value: unknown): value is HomeCountriesCacheEntry {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.cachedAt === "number" &&
    Number.isFinite(value.cachedAt) &&
    isHomeCountriesResponse(value.payload)
  );
}

function dedupeBySlug(categories: HomeCategory[]) {
  const seen = new Set<string>();
  const deduped: HomeCategory[] = [];

  for (const category of categories) {
    if (seen.has(category.slug)) {
      continue;
    }

    seen.add(category.slug);
    deduped.push(category);
  }

  return deduped;
}

function dedupeByCode(countries: HomeCountry[]) {
  const seen = new Set<string>();
  const deduped: HomeCountry[] = [];

  for (const country of countries) {
    if (seen.has(country.code)) {
      continue;
    }

    seen.add(country.code);
    deduped.push(country);
  }

  return deduped;
}

function readCachedHomeCategories() {
  const storage = getStorage();
  const raw = storage?.getItem(HOME_CATEGORIES_CACHE_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (!isHomeCategoriesCacheEntry(parsed)) {
      storage?.removeItem(HOME_CATEGORIES_CACHE_KEY);
      return null;
    }

    if (Date.now() - parsed.cachedAt >= HOME_CATEGORIES_TTL_MS) {
      storage?.removeItem(HOME_CATEGORIES_CACHE_KEY);
      return null;
    }

    return parsed.payload;
  } catch {
    storage?.removeItem(HOME_CATEGORIES_CACHE_KEY);
    return null;
  }
}

function readCachedHomeCountries() {
  const storage = getStorage();
  const raw = storage?.getItem(HOME_COUNTRIES_CACHE_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (!isHomeCountriesCacheEntry(parsed)) {
      storage?.removeItem(HOME_COUNTRIES_CACHE_KEY);
      return null;
    }

    if (Date.now() - parsed.cachedAt >= HOME_COUNTRIES_TTL_MS) {
      storage?.removeItem(HOME_COUNTRIES_CACHE_KEY);
      return null;
    }

    return parsed.payload;
  } catch {
    storage?.removeItem(HOME_COUNTRIES_CACHE_KEY);
    return null;
  }
}

function writeCachedHomeCategories(payload: HomeCategoriesResponse) {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  const entry: HomeCategoriesCacheEntry = {
    cachedAt: Date.now(),
    payload,
  };

  storage.setItem(HOME_CATEGORIES_CACHE_KEY, JSON.stringify(entry));
}

function writeCachedHomeCountries(payload: HomeCountriesResponse) {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  const entry: HomeCountriesCacheEntry = {
    cachedAt: Date.now(),
    payload,
  };

  storage.setItem(HOME_COUNTRIES_CACHE_KEY, JSON.stringify(entry));
}

export async function fetchHomeCategoriesPage(
  params: { limit?: number; cursor?: string } = {},
): Promise<HomeCategoriesResponse> {
  const searchParams = new URLSearchParams();
  searchParams.set("limit", String(params.limit ?? DEFAULT_LIMIT));
  if (params.cursor) {
    searchParams.set("cursor", params.cursor);
  }

  const response = await fetch(`${API_BASE}/v1.0/home/categories?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const payload: unknown = await response.json();
  if (!isHomeCategoriesResponse(payload)) {
    throw new Error("API error: invalid response shape");
  }

  return payload;
}

export async function fetchAllHomeCategories(
  params: { limit?: number } = {},
): Promise<HomeCategoriesResponse> {
  const limit = params.limit ?? DEFAULT_LIMIT;
  const merged: HomeCategory[] = [];
  let nextCursor: string | undefined;
  const seenCursors = new Set<string>();
  let lastMeta: HomeCategoriesResponse["meta"] = {};
  let lastPage: HomeCategoriesResponse["page"] = {
    next_cursor: null,
    has_more: false,
  };

  while (true) {
    if (nextCursor && seenCursors.has(nextCursor)) {
      break;
    }

    if (nextCursor) {
      seenCursors.add(nextCursor);
    }

    const page = await fetchHomeCategoriesPage({ limit, cursor: nextCursor });
    merged.push(...page.data);
    lastMeta = page.meta;
    lastPage = page.page;

    if (!page.page.has_more) {
      break;
    }

    if (!page.page.next_cursor) {
      lastPage = {
        ...page.page,
        has_more: false,
        next_cursor: null,
      };
      break;
    }

    nextCursor = page.page.next_cursor;
  }

  return {
    data: dedupeBySlug(merged),
    page: lastPage,
    meta: lastMeta,
  };
}

export async function fetchHomeCategoriesCached(
  params: { limit?: number } = {},
): Promise<HomeCategoriesResponse> {
  const cached = readCachedHomeCategories();
  if (cached) {
    return cached;
  }

  const payload = await fetchAllHomeCategories(params);
  writeCachedHomeCategories(payload);
  return payload;
}

export async function fetchHomeCountriesPage(
  params: { limit?: number; cursor?: string } = {},
): Promise<HomeCountriesResponse> {
  const searchParams = new URLSearchParams();
  searchParams.set("limit", String(params.limit ?? DEFAULT_LIMIT));
  if (params.cursor) {
    searchParams.set("cursor", params.cursor);
  }

  const response = await fetch(`${API_BASE}/v1.0/home/countries?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const payload: unknown = await response.json();
  if (!isHomeCountriesResponse(payload)) {
    throw new Error("API error: invalid response shape");
  }

  return payload;
}

export async function fetchAllHomeCountries(
  params: { limit?: number } = {},
): Promise<HomeCountriesResponse> {
  const limit = params.limit ?? DEFAULT_LIMIT;
  const merged: HomeCountry[] = [];
  let nextCursor: string | undefined;
  const seenCursors = new Set<string>();
  let lastMeta: HomeCountriesResponse["meta"] = {};
  let lastPage: HomeCountriesResponse["page"] = {
    next_cursor: null,
    has_more: false,
  };

  while (true) {
    if (nextCursor && seenCursors.has(nextCursor)) {
      break;
    }

    if (nextCursor) {
      seenCursors.add(nextCursor);
    }

    const page = await fetchHomeCountriesPage({ limit, cursor: nextCursor });
    merged.push(...page.data);
    lastMeta = page.meta;
    lastPage = page.page;

    if (!page.page.has_more) {
      break;
    }

    if (!page.page.next_cursor) {
      lastPage = {
        ...page.page,
        has_more: false,
        next_cursor: null,
      };
      break;
    }

    nextCursor = page.page.next_cursor;
  }

  return {
    data: dedupeByCode(merged),
    page: lastPage,
    meta: lastMeta,
  };
}

export async function fetchHomeCountriesCached(
  params: { limit?: number } = {},
): Promise<HomeCountriesResponse> {
  const cached = readCachedHomeCountries();
  if (cached) {
    return cached;
  }

  const payload = await fetchAllHomeCountries(params);
  writeCachedHomeCountries(payload);
  return payload;
}
