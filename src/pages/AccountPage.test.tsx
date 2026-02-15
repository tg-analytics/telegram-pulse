import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AccountPage from "@/pages/AccountPage";

const useAuthMock = vi.fn();
const useAccountProfileMock = vi.fn();
const useAccountTeamMock = vi.fn();
const useAccountApiKeysMock = vi.fn();
const useAccountBillingMock = vi.fn();
const useAccountChannelsMock = vi.fn();
const toastMock = vi.fn();

const updateMeMutateAsync = vi.fn();
const inviteMemberMutateAsync = vi.fn();
const removeMemberMutateAsync = vi.fn();
const createApiKeyMutateAsync = vi.fn();
const revokeApiKeyMutateAsync = vi.fn();
const updateSubscriptionMutateAsync = vi.fn();
const invoiceDownloadMutateAsync = vi.fn();
const fetchNextPageMock = vi.fn();
const accountChannelsFetchNextPageMock = vi.fn();

vi.mock("react-router-dom", () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => <a href={to}>{children}</a>,
}));

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => useAuthMock(),
}));

vi.mock("@/hooks/useAccountProfile", () => ({
  useAccountProfile: () => useAccountProfileMock(),
}));

vi.mock("@/hooks/useAccountTeam", () => ({
  useAccountTeam: (...args: unknown[]) => useAccountTeamMock(...args),
}));

vi.mock("@/hooks/useAccountApiKeys", () => ({
  useAccountApiKeys: (...args: unknown[]) => useAccountApiKeysMock(...args),
}));

vi.mock("@/hooks/useAccountBilling", () => ({
  useAccountBilling: (...args: unknown[]) => useAccountBillingMock(...args),
}));

vi.mock("@/hooks/useAccountChannels", () => ({
  useAccountChannels: (...args: unknown[]) => useAccountChannelsMock(...args),
}));

vi.mock("@/hooks/use-toast", () => ({
  toast: (...args: unknown[]) => toastMock(...args),
}));

vi.mock("@/components/layout/MainLayout", () => ({
  MainLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/ui/tabs", () => ({
  Tabs: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TabsList: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TabsTrigger: ({ children }: { children: React.ReactNode }) => <button type="button">{children}</button>,
  TabsContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <h3>{children}</h3>,
  DialogDescription: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
  DialogFooter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/ui/select", () => ({
  Select: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectValue: () => <span />,
  SelectContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/ui/switch", () => ({
  Switch: ({ checked, onCheckedChange, disabled, id }: { checked?: boolean; onCheckedChange?: (checked: boolean) => void; disabled?: boolean; id?: string }) => (
    <input
      type="checkbox"
      role="checkbox"
      id={id}
      checked={Boolean(checked)}
      disabled={disabled}
      onChange={(event) => onCheckedChange?.(event.target.checked)}
    />
  ),
}));

function renderPage() {
  return render(<AccountPage />);
}

beforeEach(() => {
  vi.clearAllMocks();

  vi.stubGlobal("confirm", vi.fn(() => true));
  vi.stubGlobal("open", vi.fn());

  useAuthMock.mockReturnValue({
    session: { account_id: "acc-1" },
  });

  useAccountProfileMock.mockReturnValue({
    meQuery: {
      data: {
        email: "john@example.com",
        first_name: "John",
        last_name: "Doe",
        telegram_username: "@johndoe",
      },
      isLoading: false,
      isError: false,
      error: null,
    },
    preferencesQuery: {
      data: { data: { language_code: "en", timezone: "UTC", theme: "system" } },
      isLoading: false,
      isError: false,
      error: null,
    },
    notificationsQuery: {
      data: {
        data: {
          email_notifications: true,
          telegram_bot_alerts: true,
          weekly_reports: false,
          marketing_updates: false,
          push_notifications: false,
        },
      },
      isLoading: false,
      isError: false,
      error: null,
    },
    updateMeMutation: { mutateAsync: updateMeMutateAsync, isPending: false },
    updatePreferencesMutation: { mutateAsync: vi.fn(), isPending: false },
    updateNotificationsMutation: { mutateAsync: vi.fn(), isPending: false },
  });

  useAccountTeamMock.mockReturnValue({
    teamQuery: {
      data: {
        data: [
          {
            member_id: "m-1",
            email: "member@example.com",
            first_name: "Jane",
            last_name: "Smith",
            role: "admin",
            status: "active",
          },
        ],
      },
      isLoading: false,
      isError: false,
      error: null,
    },
    inviteMemberMutation: { mutateAsync: inviteMemberMutateAsync, isPending: false },
    removeMemberMutation: { mutateAsync: removeMemberMutateAsync, isPending: false },
  });

  useAccountApiKeysMock.mockReturnValue({
    from: "2026-02-01",
    to: "2026-02-15",
    apiKeysQuery: { isLoading: false, isError: false, error: null },
    apiUsageQuery: {
      data: { data: { total_requests: 120, error_rate: 0.5, avg_latency_ms: 100, by_day: [] } },
      isError: false,
      error: null,
    },
    activeApiKeys: [
      {
        api_key_id: "k-1",
        name: "Prod",
        key_prefix: "tlm_prod_",
        scopes: ["read:channels"],
        rate_limit_per_hour: 1000,
        created_at: "2026-02-14T12:00:00Z",
        last_used_at: null,
        revoked_at: null,
      },
    ],
    createApiKeyMutation: { mutateAsync: createApiKeyMutateAsync, isPending: false },
    revokeApiKeyMutation: { mutateAsync: revokeApiKeyMutateAsync, isPending: false },
  });

  useAccountBillingMock.mockReturnValue({
    from: "2026-02-01",
    to: "2026-02-15",
    subscriptionQuery: {
      data: { data: { plan_code: "pro", cancel_at_period_end: false, current_period_end: "2026-03-01T00:00:00Z" } },
      isError: false,
      error: null,
    },
    usageQuery: {
      data: { data: { channel_searches: 1, event_trackers_count: 2, api_requests_count: 3, exports_count: 4 } },
      isError: false,
      error: null,
    },
    paymentMethodsQuery: { isLoading: false, isError: false, error: null },
    sortedPaymentMethods: [
      {
        payment_method_id: "p-1",
        brand: "VISA",
        last4: "4242",
        exp_month: 12,
        exp_year: 2027,
        is_default: true,
      },
    ],
    invoicesQuery: {
      data: {
        pages: [
          {
            data: [
              {
                invoice_id: "i-1",
                invoice_number: "INV-1",
                status: "paid",
                currency: "USD",
                amount_total: 49,
                period_start: "2026-02-01",
                period_end: "2026-02-28",
              },
            ],
          },
        ],
      },
      isLoading: false,
      isError: false,
      error: null,
      hasNextPage: true,
      fetchNextPage: fetchNextPageMock,
      isFetchingNextPage: false,
    },
    updateSubscriptionMutation: { mutateAsync: updateSubscriptionMutateAsync, isPending: false },
    invoiceDownloadMutation: { mutateAsync: invoiceDownloadMutateAsync, isPending: false },
  });

  useAccountChannelsMock.mockReturnValue({
    channels: [
      {
        account_id: "acc-1",
        channel_id: "ch-1",
        alias_name: "Primary Tech Channel",
        monitoring_enabled: true,
        is_favorite: true,
        added_at: "2026-02-14T12:00:00Z",
        verified: true,
      },
      {
        account_id: "acc-1",
        channel_id: "ch-2",
        alias_name: "Market Updates",
        monitoring_enabled: false,
        is_favorite: false,
        added_at: "2026-02-13T12:00:00Z",
      },
    ],
    channelsQuery: {
      isLoading: false,
      isError: false,
      error: null,
    },
    hasNextPage: false,
    isFetchingNextPage: false,
    fetchNextPage: accountChannelsFetchNextPageMock,
  });

  createApiKeyMutateAsync.mockResolvedValue({ data: { secret: "tlm_prod_secret" } });
  invoiceDownloadMutateAsync.mockResolvedValue({ data: { url: "https://example.com/invoice.pdf" } });
});

describe("AccountPage", () => {
  it("saves personal profile payload", async () => {
    renderPage();

    fireEvent.change(screen.getByLabelText("First Name"), { target: { value: "Johnny" } });
    fireEvent.change(screen.getByLabelText("Last Name"), { target: { value: "Doe" } });
    fireEvent.change(screen.getByLabelText("Telegram Username"), { target: { value: "@johnny" } });

    fireEvent.click(screen.getByRole("button", { name: "Save Changes" }));

    await waitFor(() => {
      expect(updateMeMutateAsync).toHaveBeenCalledWith({
        first_name: "Johnny",
        last_name: "Doe",
        telegram_username: "@johnny",
      });
    });
  });

  it("invites and removes team members", async () => {
    renderPage();

    fireEvent.change(screen.getByLabelText("Email Address"), { target: { value: "new@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Send Invite" }));

    await waitFor(() => {
      expect(inviteMemberMutateAsync).toHaveBeenCalledWith({
        email: "new@example.com",
        role: "viewer",
        channel_access: [],
      });
    });

    fireEvent.click(screen.getByRole("button", { name: "Remove Jane Smith" }));

    await waitFor(() => {
      expect(removeMemberMutateAsync).toHaveBeenCalledWith("m-1");
    });
  });

  it("creates and revokes API keys", async () => {
    renderPage();

    fireEvent.change(screen.getByLabelText("Key Name"), { target: { value: "Backend" } });
    fireEvent.click(screen.getByRole("button", { name: "Create Key" }));

    await waitFor(() => {
      expect(createApiKeyMutateAsync).toHaveBeenCalledWith({
        name: "Backend",
        scopes: ["read:channels", "read:ads"],
        rate_limit_per_hour: 1000,
      });
    });

    fireEvent.click(screen.getByRole("button", { name: "Revoke Prod" }));

    await waitFor(() => {
      expect(revokeApiKeyMutateAsync).toHaveBeenCalledWith("k-1");
    });
  });

  it("loads more invoices and downloads invoice", async () => {
    renderPage();

    fireEvent.click(screen.getByRole("button", { name: "Load More" }));
    expect(fetchNextPageMock).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: "Download INV-1" }));

    await waitFor(() => {
      expect(invoiceDownloadMutateAsync).toHaveBeenCalledWith("i-1");
      expect(global.open).toHaveBeenCalledWith("https://example.com/invoice.pdf", "_blank", "noopener,noreferrer");
    });
  });

  it("renders month-to-date labels from hooks", () => {
    renderPage();

    expect(screen.getByText(/API Usage \(2026-02-01 to 2026-02-15\)/)).toBeInTheDocument();
    expect(screen.getAllByText(/2026-02-01 to 2026-02-15/).length).toBeGreaterThan(0);
  });

  it("renders account channels with favorite, monitoring, and verification state", () => {
    renderPage();

    expect(screen.getByText("Primary Tech Channel")).toBeInTheDocument();
    expect(screen.getByText("Market Updates")).toBeInTheDocument();
    expect(screen.getByText("Favorite")).toBeInTheDocument();
    expect(screen.getByText("Monitoring On")).toBeInTheDocument();
    expect(screen.getByText("Monitoring Off")).toBeInTheDocument();
    expect(screen.getByText("Verified")).toBeInTheDocument();
  });

  it("does not show verified badge when verified is missing", () => {
    useAccountChannelsMock.mockReturnValue({
      channels: [
        {
          account_id: "acc-1",
          channel_id: "ch-2",
          alias_name: "Only Unverified",
          monitoring_enabled: false,
          is_favorite: false,
          added_at: "2026-02-13T12:00:00Z",
        },
      ],
      channelsQuery: {
        isLoading: false,
        isError: false,
        error: null,
      },
      hasNextPage: false,
      isFetchingNextPage: false,
      fetchNextPage: accountChannelsFetchNextPageMock,
    });

    renderPage();
    expect(screen.queryByText("Verified")).not.toBeInTheDocument();
  });

  it("loads more channels when channel pagination is available", () => {
    useAccountChannelsMock.mockReturnValue({
      channels: [
        {
          account_id: "acc-1",
          channel_id: "ch-1",
          alias_name: "Primary Tech Channel",
          monitoring_enabled: true,
          is_favorite: true,
          added_at: "2026-02-14T12:00:00Z",
          verified: true,
        },
      ],
      channelsQuery: {
        isLoading: false,
        isError: false,
        error: null,
      },
      hasNextPage: true,
      isFetchingNextPage: false,
      fetchNextPage: accountChannelsFetchNextPageMock,
    });

    renderPage();
    fireEvent.click(screen.getAllByRole("button", { name: "Load More" })[0]);
    expect(accountChannelsFetchNextPageMock).toHaveBeenCalledTimes(1);
  });

  it("shows channels empty state", () => {
    useAccountChannelsMock.mockReturnValue({
      channels: [],
      channelsQuery: {
        isLoading: false,
        isError: false,
        error: null,
      },
      hasNextPage: false,
      isFetchingNextPage: false,
      fetchNextPage: accountChannelsFetchNextPageMock,
    });

    renderPage();
    expect(screen.getByText("No channels connected to this account yet.")).toBeInTheDocument();
  });

  it("shows channels error state", () => {
    useAccountChannelsMock.mockReturnValue({
      channels: [],
      channelsQuery: {
        isLoading: false,
        isError: true,
        error: new Error("channels exploded"),
      },
      hasNextPage: false,
      isFetchingNextPage: false,
      fetchNextPage: accountChannelsFetchNextPageMock,
    });

    renderPage();
    expect(screen.getByText("channels exploded")).toBeInTheDocument();
  });
});
