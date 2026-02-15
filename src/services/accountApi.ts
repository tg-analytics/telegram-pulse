import { API_BASE } from "@/config/api";
import { getAccessToken } from "@/services/authStorage";

export interface ApiErrorShape {
  error?: {
    code?: string;
    message?: string;
    details?: unknown[];
  };
  message?: string;
  detail?: string;
}

export interface Me {
  email: string;
  first_name: string;
  last_name: string;
  telegram_username: string;
}

export interface UpdateMePayload {
  first_name: string;
  last_name: string;
  telegram_username: string;
}

export interface Preferences {
  language_code: string;
  timezone: string;
  theme: "light" | "dark" | "system";
}

export interface Notifications {
  email_notifications: boolean;
  telegram_bot_alerts: boolean;
  weekly_reports: boolean;
  marketing_updates: boolean;
  push_notifications: boolean;
}

export interface MetaResponse {
  meta: Record<string, unknown>;
}

export interface DataResponse<T> extends MetaResponse {
  data: T;
}

export interface TeamMember {
  member_id: string;
  user_id?: string | null;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  role: string;
  status: string;
  invited_at?: string | null;
  joined_at?: string | null;
}

export interface TeamMembersResponse extends DataResponse<TeamMember[]> {}

export interface AccountChannel {
  account_id: string;
  channel_id: string;
  alias_name: string;
  monitoring_enabled: boolean;
  is_favorite: boolean;
  added_at: string;
  verified?: boolean;
}

export interface AccountChannelsPage {
  next_cursor: string | null;
  has_more: boolean;
}

export interface AccountChannelsResponse extends MetaResponse {
  data: AccountChannel[];
  page: AccountChannelsPage;
}

export interface InviteMemberPayload {
  email: string;
  role: string;
  channel_access: string[];
}

export interface ApiKey {
  api_key_id: string;
  name: string;
  key_prefix: string;
  scopes: string[];
  rate_limit_per_hour: number;
  created_at: string;
  last_used_at: string | null;
  revoked_at: string | null;
}

export interface ApiKeysResponse extends DataResponse<ApiKey[]> {}

export interface CreateApiKeyPayload {
  name: string;
  scopes: string[];
  rate_limit_per_hour: number;
}

export interface CreateApiKeyResponse extends DataResponse<{
  api_key: ApiKey;
  secret: string;
}> {
  meta: {
    secret_returned_once?: boolean;
    [key: string]: unknown;
  };
}

export interface ApiUsageDay {
  date: string;
  requests: number;
  errors: number;
}

export interface ApiUsage {
  total_requests: number;
  error_rate: number;
  avg_latency_ms: number;
  by_day: ApiUsageDay[];
}

export interface Subscription {
  subscription_id: string;
  account_id: string;
  plan_code: string;
  status: string;
  billing_state: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
}

export interface UpdateSubscriptionPayload {
  plan_code: string;
  cancel_at_period_end: boolean;
}

export interface BillingUsage {
  from: string;
  to: string;
  channel_searches: number;
  event_trackers_count: number;
  api_requests_count: number;
  exports_count: number;
}

export interface PaymentMethod {
  payment_method_id: string;
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  is_default: boolean;
  status: string;
}

export interface PaymentMethodsResponse extends DataResponse<PaymentMethod[]> {}

export interface Invoice {
  invoice_id: string;
  invoice_number: string;
  status: string;
  currency: string;
  amount_total: number;
  period_start: string;
  period_end: string;
  issued_at: string;
  paid_at: string | null;
}

export interface InvoicesPage {
  next_cursor: string | null;
  has_more: boolean;
}

export interface InvoicesResponse extends MetaResponse {
  data: Invoice[];
  page: InvoicesPage;
}

export interface InvoiceDownloadUrl {
  url: string;
  expires_at: string;
}

function getBearerHeader(): Record<string, string> {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function getAccountHeaders(accountId: string): Record<string, string> {
  return {
    ...getBearerHeader(),
    "X-Account-Id": accountId,
  };
}

async function parseApiErrorMessage(response: Response, fallback: string): Promise<string> {
  try {
    const payload: ApiErrorShape | string = await response.json();

    if (typeof payload === "string" && payload.trim()) {
      return payload;
    }

    if (payload && typeof payload === "object") {
      const nested = payload.error?.message;
      if (typeof nested === "string" && nested.trim()) {
        return nested;
      }

      if (typeof payload.message === "string" && payload.message.trim()) {
        return payload.message;
      }

      if (typeof payload.detail === "string" && payload.detail.trim()) {
        return payload.detail;
      }
    }
  } catch {
    // Ignore parse errors.
  }

  return fallback;
}

async function parseJsonOrThrow<T>(response: Response, fallback: string): Promise<T> {
  if (!response.ok) {
    throw new Error(await parseApiErrorMessage(response, fallback));
  }

  return response.json() as Promise<T>;
}

export async function fetchMe(): Promise<Me> {
  const response = await fetch(`${API_BASE}/v1.0/users/me`, {
    headers: getBearerHeader(),
  });

  return parseJsonOrThrow<Me>(response, `Failed to load profile (${response.status}).`);
}

export async function updateMe(payload: UpdateMePayload): Promise<Me> {
  const response = await fetch(`${API_BASE}/v1.0/users/me`, {
    method: "PATCH",
    headers: {
      ...getBearerHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseJsonOrThrow<Me>(response, `Failed to update profile (${response.status}).`);
}

export async function fetchPreferences(): Promise<DataResponse<Preferences>> {
  const response = await fetch(`${API_BASE}/v1.0/users/me/preferences`, {
    headers: getBearerHeader(),
  });

  return parseJsonOrThrow<DataResponse<Preferences>>(
    response,
    `Failed to load preferences (${response.status}).`,
  );
}

export async function updatePreferences(payload: Preferences): Promise<DataResponse<Preferences>> {
  const response = await fetch(`${API_BASE}/v1.0/users/me/preferences`, {
    method: "PATCH",
    headers: {
      ...getBearerHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseJsonOrThrow<DataResponse<Preferences>>(
    response,
    `Failed to update preferences (${response.status}).`,
  );
}

export async function fetchNotifications(): Promise<DataResponse<Notifications>> {
  const response = await fetch(`${API_BASE}/v1.0/users/me/notifications`, {
    headers: getBearerHeader(),
  });

  return parseJsonOrThrow<DataResponse<Notifications>>(
    response,
    `Failed to load notifications (${response.status}).`,
  );
}

export async function updateNotifications(payload: Notifications): Promise<DataResponse<Notifications>> {
  const response = await fetch(`${API_BASE}/v1.0/users/me/notifications`, {
    method: "PATCH",
    headers: {
      ...getBearerHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseJsonOrThrow<DataResponse<Notifications>>(
    response,
    `Failed to update notifications (${response.status}).`,
  );
}

export async function fetchMembers(accountId: string): Promise<TeamMembersResponse> {
  const response = await fetch(`${API_BASE}/v1.0/accounts/${accountId}/members`, {
    headers: getAccountHeaders(accountId),
  });

  return parseJsonOrThrow<TeamMembersResponse>(response, `Failed to load team members (${response.status}).`);
}

export async function fetchAccountChannels(
  accountId: string,
  params: { limit?: number; cursor?: string } = {},
): Promise<AccountChannelsResponse> {
  const search = new URLSearchParams();
  search.set("limit", String(params.limit ?? 20));
  if (params.cursor) {
    search.set("cursor", params.cursor);
  }

  const response = await fetch(`${API_BASE}/v1.0/accounts/${accountId}/channels?${search.toString()}`, {
    headers: getAccountHeaders(accountId),
  });

  return parseJsonOrThrow<AccountChannelsResponse>(
    response,
    `Failed to load account channels (${response.status}).`,
  );
}

export async function inviteMember(accountId: string, payload: InviteMemberPayload): Promise<MetaResponse> {
  const response = await fetch(`${API_BASE}/v1.0/accounts/${accountId}/members/invitations`, {
    method: "POST",
    headers: {
      ...getAccountHeaders(accountId),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseJsonOrThrow<MetaResponse>(response, `Failed to invite member (${response.status}).`);
}

export async function removeMember(accountId: string, memberId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/v1.0/accounts/${accountId}/members/${memberId}`, {
    method: "DELETE",
    headers: getAccountHeaders(accountId),
  });

  if (!response.ok) {
    throw new Error(await parseApiErrorMessage(response, `Failed to remove member (${response.status}).`));
  }
}

export async function fetchApiKeys(accountId: string): Promise<ApiKeysResponse> {
  const response = await fetch(`${API_BASE}/v1.0/accounts/${accountId}/api-keys`, {
    headers: getAccountHeaders(accountId),
  });

  return parseJsonOrThrow<ApiKeysResponse>(response, `Failed to load API keys (${response.status}).`);
}

export async function createApiKey(
  accountId: string,
  payload: CreateApiKeyPayload,
): Promise<CreateApiKeyResponse> {
  const response = await fetch(`${API_BASE}/v1.0/accounts/${accountId}/api-keys`, {
    method: "POST",
    headers: {
      ...getAccountHeaders(accountId),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseJsonOrThrow<CreateApiKeyResponse>(response, `Failed to create API key (${response.status}).`);
}

export async function revokeApiKey(accountId: string, apiKeyId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/v1.0/accounts/${accountId}/api-keys/${apiKeyId}`, {
    method: "DELETE",
    headers: getAccountHeaders(accountId),
  });

  if (!response.ok) {
    throw new Error(await parseApiErrorMessage(response, `Failed to revoke API key (${response.status}).`));
  }
}

export async function fetchApiUsage(accountId: string, from: string, to: string): Promise<DataResponse<ApiUsage>> {
  const params = new URLSearchParams({ from, to });
  const response = await fetch(`${API_BASE}/v1.0/accounts/${accountId}/api-usage?${params.toString()}`, {
    headers: getAccountHeaders(accountId),
  });

  return parseJsonOrThrow<DataResponse<ApiUsage>>(response, `Failed to load API usage (${response.status}).`);
}

export async function fetchSubscription(accountId: string): Promise<DataResponse<Subscription>> {
  const response = await fetch(`${API_BASE}/v1.0/accounts/${accountId}/subscription`, {
    headers: getAccountHeaders(accountId),
  });

  return parseJsonOrThrow<DataResponse<Subscription>>(
    response,
    `Failed to load subscription (${response.status}).`,
  );
}

export async function updateSubscription(
  accountId: string,
  payload: UpdateSubscriptionPayload,
): Promise<DataResponse<Subscription>> {
  const response = await fetch(`${API_BASE}/v1.0/accounts/${accountId}/subscription`, {
    method: "PATCH",
    headers: {
      ...getAccountHeaders(accountId),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseJsonOrThrow<DataResponse<Subscription>>(
    response,
    `Failed to update subscription (${response.status}).`,
  );
}

export async function fetchBillingUsage(
  accountId: string,
  from: string,
  to: string,
): Promise<DataResponse<BillingUsage>> {
  const params = new URLSearchParams({ from, to });
  const response = await fetch(`${API_BASE}/v1.0/accounts/${accountId}/usage?${params.toString()}`, {
    headers: getAccountHeaders(accountId),
  });

  return parseJsonOrThrow<DataResponse<BillingUsage>>(response, `Failed to load usage (${response.status}).`);
}

export async function fetchPaymentMethods(accountId: string): Promise<PaymentMethodsResponse> {
  const response = await fetch(`${API_BASE}/v1.0/accounts/${accountId}/payment-methods`, {
    headers: getAccountHeaders(accountId),
  });

  return parseJsonOrThrow<PaymentMethodsResponse>(
    response,
    `Failed to load payment methods (${response.status}).`,
  );
}

export async function fetchInvoices(
  accountId: string,
  params: { limit?: number; cursor?: string } = {},
): Promise<InvoicesResponse> {
  const search = new URLSearchParams();
  search.set("limit", String(params.limit ?? 20));
  if (params.cursor) {
    search.set("cursor", params.cursor);
  }

  const response = await fetch(`${API_BASE}/v1.0/accounts/${accountId}/invoices?${search.toString()}`, {
    headers: getAccountHeaders(accountId),
  });

  return parseJsonOrThrow<InvoicesResponse>(response, `Failed to load invoices (${response.status}).`);
}

export async function fetchInvoiceDownloadUrl(
  accountId: string,
  invoiceId: string,
): Promise<DataResponse<InvoiceDownloadUrl>> {
  const response = await fetch(
    `${API_BASE}/v1.0/accounts/${accountId}/invoices/${invoiceId}/download-url`,
    {
      headers: getAccountHeaders(accountId),
    },
  );

  return parseJsonOrThrow<DataResponse<InvoiceDownloadUrl>>(
    response,
    `Failed to get invoice download URL (${response.status}).`,
  );
}

export interface AddAccountChannelPayload {
  channel_id: string;
  alias_name: string;
  monitoring_enabled: boolean;
}

export async function addAccountChannel(
  accountId: string,
  payload: AddAccountChannelPayload,
): Promise<DataResponse<AccountChannel>> {
  const response = await fetch(`${API_BASE}/v1.0/accounts/${accountId}/channels`, {
    method: "POST",
    headers: {
      ...getAccountHeaders(accountId),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseJsonOrThrow<DataResponse<AccountChannel>>(
    response,
    `Failed to add channel (${response.status}).`,
  );
}
