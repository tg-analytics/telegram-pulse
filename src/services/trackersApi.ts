import { API_BASE } from "@/config/api";
import { getAccessToken } from "@/services/authStorage";

export type TrackerStatus = "active" | "paused";
export type TrackerType = "keyword" | "channel";

export interface Tracker {
  tracker_id: string;
  account_id: string;
  tracker_type: TrackerType;
  tracker_value: string;
  status: TrackerStatus;
  mentions_count: number;
  last_activity_at: string | null;
  notify_push: boolean;
  notify_telegram: boolean;
  notify_email: boolean;
}

export interface TrackerMention {
  mention_id: string;
  tracker_id: string;
  mention_seq: number;
  channel_id: string | null;
  channel_name: string | null;
  post_id: string | null;
  mention_text: string;
  context_snippet: string | null;
  mentioned_at: string;
}

export interface TrackersResponse {
  data: Tracker[];
  meta: Record<string, unknown>;
}

export interface TrackerResponse {
  data: Tracker;
  meta: Record<string, unknown>;
}

export interface TrackerMentionsPage {
  next_cursor: string | null;
  has_more: boolean;
}

export interface TrackerMentionsResponse {
  data: TrackerMention[];
  page: TrackerMentionsPage;
  meta: Record<string, unknown>;
}

export interface TrackerFilters {
  status?: TrackerStatus;
  type?: TrackerType;
}

export interface CreateTrackerPayload {
  tracker_type: TrackerType;
  tracker_value: string;
  notify_push: boolean;
  notify_telegram: boolean;
  notify_email: boolean;
}

export interface UpdateTrackerPayload {
  status?: TrackerStatus;
  notify_push?: boolean;
  notify_telegram?: boolean;
  notify_email?: boolean;
}

export interface TrackerMentionsParams {
  tracker_id?: string;
  since?: string;
  until?: string;
  limit?: number;
  cursor?: string;
}

function getTrackerAuthHeaders(accountId: string): Record<string, string> {
  const token = getAccessToken();

  return {
    "X-Account-Id": accountId,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function parseApiErrorMessage(response: Response, fallback: string) {
  try {
    const payload = await response.json();

    if (typeof payload === "string" && payload.trim()) {
      return payload;
    }

    if (payload && typeof payload === "object") {
      const message =
        (typeof payload.detail === "string" && payload.detail) ||
        (typeof payload.message === "string" && payload.message) ||
        (typeof payload.error === "string" && payload.error);

      if (message) {
        return message;
      }
    }
  } catch {
    // Ignore JSON parse issues and use fallback below.
  }

  return fallback;
}

export async function fetchTrackers(accountId: string, filters: TrackerFilters = {}): Promise<TrackersResponse> {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.type) params.set("type", filters.type);

  const query = params.toString();
  const url = `${API_BASE}/v1.0/accounts/${accountId}/trackers${query ? `?${query}` : ""}`;

  const response = await fetch(url, {
    headers: getTrackerAuthHeaders(accountId),
  });

  if (!response.ok) {
    throw new Error(await parseApiErrorMessage(response, `API error: ${response.status}`));
  }

  return response.json();
}

export async function createTracker(accountId: string, payload: CreateTrackerPayload): Promise<TrackerResponse> {
  const response = await fetch(`${API_BASE}/v1.0/accounts/${accountId}/trackers`, {
    method: "POST",
    headers: {
      ...getTrackerAuthHeaders(accountId),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseApiErrorMessage(response, `API error: ${response.status}`));
  }

  return response.json();
}

export async function updateTracker(
  accountId: string,
  trackerId: string,
  payload: UpdateTrackerPayload,
): Promise<TrackerResponse> {
  const response = await fetch(`${API_BASE}/v1.0/accounts/${accountId}/trackers/${trackerId}`, {
    method: "PATCH",
    headers: {
      ...getTrackerAuthHeaders(accountId),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseApiErrorMessage(response, `API error: ${response.status}`));
  }

  return response.json();
}

export async function deleteTracker(accountId: string, trackerId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/v1.0/accounts/${accountId}/trackers/${trackerId}`, {
    method: "DELETE",
    headers: getTrackerAuthHeaders(accountId),
  });

  if (!response.ok) {
    throw new Error(await parseApiErrorMessage(response, `API error: ${response.status}`));
  }
}

export async function fetchTrackerMentions(
  accountId: string,
  params: TrackerMentionsParams = {},
): Promise<TrackerMentionsResponse> {
  const searchParams = new URLSearchParams();
  if (params.tracker_id) searchParams.set("tracker_id", params.tracker_id);
  if (params.since) searchParams.set("since", params.since);
  if (params.until) searchParams.set("until", params.until);
  if (params.limit !== undefined) searchParams.set("limit", String(params.limit));
  if (params.cursor) searchParams.set("cursor", params.cursor);

  const query = searchParams.toString();
  const url = `${API_BASE}/v1.0/accounts/${accountId}/tracker-mentions${query ? `?${query}` : ""}`;

  const response = await fetch(url, {
    headers: getTrackerAuthHeaders(accountId),
  });

  if (!response.ok) {
    throw new Error(await parseApiErrorMessage(response, `API error: ${response.status}`));
  }

  return response.json();
}
