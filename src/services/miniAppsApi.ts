import { API_BASE } from "@/config/api";
import { getAccessToken } from "@/services/authStorage";

export type MiniAppsSummaryPeriod = "7d" | "30d" | "90d";

export interface MiniAppSummaryResponse {
  data: {
    total_mini_apps: number;
    daily_active_users: number;
    total_sessions: number;
    avg_session_seconds: number;
    total_mini_apps_delta: number;
    daily_active_users_delta: number;
    daily_active_users_delta_percent: number;
    total_sessions_delta: number;
    total_sessions_delta_percent: number;
    avg_session_seconds_delta: number;
  };
  meta: Record<string, unknown>;
}

export interface MiniApp {
  mini_app_id: string;
  name: string;
  slug: string;
  category_slug: string;
  daily_users: number;
  total_users: number;
  sessions: number;
  rating: number;
  growth_weekly: number;
  launched_at: string;
}

export interface MiniAppsResponse {
  data: MiniApp[];
  page: {
    next_cursor: string | null;
    has_more: boolean;
  };
  meta: {
    total_estimate?: number;
  };
}

export interface MiniAppsFilters {
  q?: string;
  category_slug?: string;
  min_daily_users?: number;
  min_rating?: number;
  launch_within_days?: number;
  min_growth?: number;
  sort_by?: "daily_users" | "growth" | "rating" | "launched_at" | "total_users";
  sort_order?: "asc" | "desc";
  limit?: number;
  cursor?: string;
}

function getAuthHeaders(): Record<string, string> {
  const token = getAccessToken();
  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchMiniAppsSummary(
  period: MiniAppsSummaryPeriod = "7d",
): Promise<MiniAppSummaryResponse> {
  const params = new URLSearchParams();
  params.set("period", period);

  const response = await fetch(`${API_BASE}/v1.0/mini-apps/summary?${params.toString()}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

export async function fetchMiniApps(filters: MiniAppsFilters = {}): Promise<MiniAppsResponse> {
  const params = new URLSearchParams();

  if (filters.q) params.set("q", filters.q);
  if (filters.category_slug && filters.category_slug !== "all") {
    params.set("category_slug", filters.category_slug);
  }
  if (filters.min_daily_users !== undefined) params.set("min_daily_users", String(filters.min_daily_users));
  if (filters.min_rating !== undefined) params.set("min_rating", String(filters.min_rating));
  if (filters.launch_within_days !== undefined) {
    params.set("launch_within_days", String(filters.launch_within_days));
  }
  if (filters.min_growth !== undefined) params.set("min_growth", String(filters.min_growth));
  if (filters.sort_by) params.set("sort_by", filters.sort_by);
  if (filters.sort_order) params.set("sort_order", filters.sort_order);
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.cursor) params.set("cursor", filters.cursor);

  if (!filters.sort_by) {
    params.set("sort_by", "daily_users");
    params.set("sort_order", "desc");
  }
  if (!filters.limit) {
    params.set("limit", "20");
  }

  const response = await fetch(`${API_BASE}/v1.0/mini-apps?${params.toString()}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}
