import { API_BASE } from "@/config/api";
import { getAccessToken } from "@/services/authStorage";

export interface Channel {
  channel_id: string;
  name: string;
  username: string;
  subscribers: number;
  growth_24h: number;
  growth_7d: number;
  growth_30d: number;
  engagement_rate: number;
  category_slug: string;
  country_code: string;
  status: string;
  verified: boolean;
  scam: boolean;
}

export interface ChannelsResponse {
  data: Channel[];
  page: {
    next_cursor: string | null;
    has_more: boolean;
  };
  meta: {
    total_estimate: number;
  };
}

export interface ChannelFilters {
  q?: string;
  country_code?: string;
  category_slug?: string;
  size_bucket?: string;
  er_min?: number;
  er_max?: number;
  verified?: boolean;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  limit?: number;
  cursor?: string;
}

export interface KpiMetric {
  value: number;
  delta: number;
  delta_percent: number;
}

export interface OverviewChannel {
  channel_id: string;
  telegram_channel_id: number;
  name: string;
  username: string | null;
  avatar_url: string | null;
  description: string | null;
  about_text: string | null;
  website_url: string | null;
  status: string;
  country_code: string | null;
  category_slug: string | null;
  category_name: string | null;
}

export interface OverviewKpis {
  subscribers: KpiMetric;
  avg_views: KpiMetric;
  engagement_rate: KpiMetric;
  posts_per_day: KpiMetric;
}

export interface OverviewChartPoint {
  date: string;
  subscribers: number;
  engagement_rate: number;
}

export interface OverviewSimilarChannel {
  channel_id: string;
  name: string;
  username: string | null;
  subscribers: number;
  similarity_score: number;
}

export interface OverviewTag {
  tag_id: string;
  slug: string;
  name: string;
  relevance_score: number;
}

export interface OverviewRecentPost {
  post_id: string;
  telegram_message_id: number;
  published_at: string;
  title: string | null;
  content_text: string | null;
  views_count: number;
  reactions_count: number;
  comments_count: number;
  forwards_count: number;
  external_post_url: string | null;
}

export interface OverviewInOut30d {
  incoming: number;
  outgoing: number;
}

export interface ChannelOverviewData {
  channel: OverviewChannel;
  kpis: OverviewKpis;
  chart: {
    range: string;
    points: OverviewChartPoint[];
  };
  similar_channels: OverviewSimilarChannel[];
  tags: OverviewTag[];
  recent_posts: OverviewRecentPost[];
  inout_30d?: OverviewInOut30d;
  incoming_30d?: number;
  outgoing_30d?: number;
}

export interface ChannelOverviewResponse {
  data: ChannelOverviewData;
  meta: Record<string, unknown>;
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

export async function fetchChannels(filters: ChannelFilters = {}): Promise<ChannelsResponse> {
  const params = new URLSearchParams();

  if (filters.q) params.set("q", filters.q);
  if (filters.country_code && filters.country_code !== "all") params.set("country_code", filters.country_code);
  if (filters.category_slug && filters.category_slug !== "all") params.set("category_slug", filters.category_slug);
  if (filters.size_bucket && filters.size_bucket !== "all") params.set("size_bucket", filters.size_bucket);
  if (filters.er_min !== undefined) params.set("er_min", String(filters.er_min));
  if (filters.er_max !== undefined) params.set("er_max", String(filters.er_max));
  if (filters.verified !== undefined) params.set("verified", String(filters.verified));
  if (filters.sort_by) params.set("sort_by", filters.sort_by);
  if (filters.sort_order) params.set("sort_order", filters.sort_order);
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.cursor) params.set("cursor", filters.cursor);

  // Default sort
  if (!filters.sort_by) {
    params.set("sort_by", "subscribers");
    params.set("sort_order", "desc");
  }
  if (!filters.limit) {
    params.set("limit", "20");
  }

  const headers = getAuthHeaders();

  const response = await fetch(`${API_BASE}/v1.0/channels?${params.toString()}`, { headers });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

export async function fetchChannelOverview(channelId: string): Promise<ChannelOverviewResponse> {
  const response = await fetch(`${API_BASE}/v1.0/channels/${channelId}/overview`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}
