import { API_BASE } from "@/config/api";
import { getAccessToken } from "@/services/authStorage";

export type AdvertiserSortBy =
  | "estimated_spend"
  | "total_ads"
  | "channels_used"
  | "avg_engagement_rate"
  | "trend";

export interface Advertiser {
  rank: number;
  advertiser_id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  industry_slug: string | null;
  industry_name: string | null;
  estimated_spend: number;
  total_ads: number;
  channels_used: number;
  avg_engagement_rate: number;
  trend: number;
  active_creatives: number;
  last_active_at: string | null;
}

export interface AdvertisersResponse {
  data: Advertiser[];
  page: {
    next_cursor: string | null;
    has_more: boolean;
  };
  meta: {
    total_estimate: number;
    time_period_days: number;
    snapshot_date: string;
    baseline_date: string;
  };
}

export interface AdvertisersFilters {
  q?: string;
  industry_slug?: string;
  time_period_days?: number;
  min_spend?: number;
  min_channels?: number;
  min_engagement?: number;
  activity_status?: "active" | "recent";
  sort_by?: AdvertiserSortBy;
  sort_order?: "asc" | "desc";
  limit?: number;
  cursor?: string;
}

export interface AdvertisersSummaryData {
  active_advertisers: number;
  total_ad_spend: number;
  ad_campaigns: number;
  avg_engagement_rate: number;
  active_advertisers_delta: number;
  total_ad_spend_delta: number;
  total_ad_spend_delta_percent: number;
  ad_campaigns_delta: number;
  ad_campaigns_delta_percent: number;
  avg_engagement_rate_delta: number;
  avg_engagement_rate_delta_percent: number;
}

export interface AdvertisersSummaryResponse {
  data: AdvertisersSummaryData;
  meta: {
    time_period_days: number;
    snapshot_date: string;
    baseline_date: string;
  };
}

export interface AdvertiserTopChannel {
  channel_id: string;
  name: string;
  username: string | null;
  rank: number;
  impressions: number;
  estimated_spend: number;
  engagement_rate: number;
}

export interface AdvertiserDetail extends Advertiser {
  website_url: string | null;
  description: string | null;
  top_channels: AdvertiserTopChannel[];
}

export interface AdvertiserDetailResponse {
  data: AdvertiserDetail;
  meta: {
    snapshot_date: string;
  };
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

export async function fetchAdvertisers(filters: AdvertisersFilters = {}): Promise<AdvertisersResponse> {
  const params = new URLSearchParams();

  if (filters.q) params.set("q", filters.q);
  if (filters.industry_slug && filters.industry_slug !== "all") {
    params.set("industry_slug", filters.industry_slug);
  }
  if (filters.min_spend !== undefined) params.set("min_spend", String(filters.min_spend));
  if (filters.min_channels !== undefined) params.set("min_channels", String(filters.min_channels));
  if (filters.min_engagement !== undefined) params.set("min_engagement", String(filters.min_engagement));
  if (filters.activity_status) params.set("activity_status", filters.activity_status);
  if (filters.cursor) params.set("cursor", filters.cursor);

  params.set("time_period_days", String(filters.time_period_days ?? 30));
  params.set("sort_by", filters.sort_by ?? "estimated_spend");
  params.set("sort_order", filters.sort_order ?? "desc");
  params.set("limit", String(filters.limit ?? 20));

  const response = await fetch(`${API_BASE}/v1.0/advertisers?${params.toString()}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

export async function fetchAdvertisersSummary(
  timePeriodDays = 30,
): Promise<AdvertisersSummaryResponse> {
  const params = new URLSearchParams();
  params.set("time_period_days", String(timePeriodDays));

  const response = await fetch(`${API_BASE}/v1.0/advertisers/summary?${params.toString()}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

export async function fetchAdvertiserDetail(advertiserId: string): Promise<AdvertiserDetailResponse> {
  const response = await fetch(`${API_BASE}/v1.0/advertisers/${advertiserId}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}
