import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import AdvertisersPage from "@/pages/AdvertisersPage";

const useAdvertisersMock = vi.fn();
const useAdvertisersSummaryMock = vi.fn();
const useAdvertiserDetailMock = vi.fn();

vi.mock("@/hooks/useAdvertisers", () => ({
  useAdvertisers: (...args: unknown[]) => useAdvertisersMock(...args),
}));

vi.mock("@/hooks/useAdvertisersSummary", () => ({
  useAdvertisersSummary: (...args: unknown[]) => useAdvertisersSummaryMock(...args),
}));

vi.mock("@/hooks/useAdvertiserDetail", () => ({
  useAdvertiserDetail: (...args: unknown[]) => useAdvertiserDetailMock(...args),
}));

vi.mock("@/components/layout/MainLayout", () => ({
  MainLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const summaryPayload = {
  data: {
    active_advertisers: 12450,
    total_ad_spend: 48200000,
    ad_campaigns: 156000,
    avg_engagement_rate: 3.8,
    active_advertisers_delta: 234,
    total_ad_spend_delta: 6200000,
    total_ad_spend_delta_percent: 14.8,
    ad_campaigns_delta: 17100,
    ad_campaigns_delta_percent: 12.3,
    avg_engagement_rate_delta: 0.2,
    avg_engagement_rate_delta_percent: 5.6,
  },
  meta: {
    time_period_days: 30,
    snapshot_date: "2026-02-14",
    baseline_date: "2026-01-15",
  },
};

const advertiserA = {
  rank: 1,
  advertiser_id: "2e63db9e-13f7-4204-b8b6-a394f40ca83a",
  name: "Binance",
  slug: "binance",
  logo_url: "https://cdn.example.com/adv/binance.png",
  industry_slug: "crypto",
  industry_name: "Crypto",
  estimated_spend: 2500000,
  total_ads: 4500,
  channels_used: 1200,
  avg_engagement_rate: 4.2,
  trend: 15.3,
  active_creatives: 156,
  last_active_at: "2026-02-14T08:00:00Z",
};

const advertiserB = {
  rank: 2,
  advertiser_id: "9a2cd51e-e4f8-4de0-b4f3-393f18e10af5",
  name: "Telegram Premium",
  slug: "telegram-premium",
  logo_url: null,
  industry_slug: "finance",
  industry_name: "Finance",
  estimated_spend: 1800000,
  total_ads: 3900,
  channels_used: 2100,
  avg_engagement_rate: 5.8,
  trend: 22.1,
  active_creatives: 89,
  last_active_at: "2026-02-13T21:30:00Z",
};

const pageOne = {
  data: [advertiserA, advertiserB],
  page: {
    next_cursor: "cursor-2",
    has_more: true,
  },
  meta: {
    total_estimate: 2,
    time_period_days: 30,
    snapshot_date: "2026-02-14",
    baseline_date: "2026-01-15",
  },
};

const pageTwo = {
  data: [
    {
      ...advertiserB,
      advertiser_id: "11111111-e4f8-4de0-b4f3-393f18e10af5",
      name: "Bybit",
      rank: 3,
      industry_slug: "crypto",
      industry_name: "Crypto",
    },
  ],
  page: {
    next_cursor: null,
    has_more: false,
  },
  meta: {
    total_estimate: 3,
    time_period_days: 30,
    snapshot_date: "2026-02-14",
    baseline_date: "2026-01-15",
  },
};

const detailPayload = {
  data: {
    ...advertiserA,
    website_url: "https://www.binance.com",
    description: "Global crypto exchange and ecosystem products.",
    top_channels: [
      {
        channel_id: "f8e98743-1448-4d13-8f8f-b8fbbf272141",
        name: "Crypto News",
        username: "@cryptonews",
        rank: 1,
        impressions: 8700000,
        estimated_spend: 520000,
        engagement_rate: 4.6,
      },
    ],
  },
  meta: {
    snapshot_date: "2026-02-14",
  },
};

function mockDefaultState() {
  useAdvertisersSummaryMock.mockReturnValue({
    data: summaryPayload,
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
  });

  useAdvertisersMock.mockReturnValue({
    data: pageOne,
    isLoading: false,
    isFetching: false,
    isError: false,
    refetch: vi.fn(),
  });

  useAdvertiserDetailMock.mockImplementation((advertiserId?: string, enabled?: boolean) => ({
    data: advertiserId && enabled ? detailPayload : undefined,
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
  }));
}

describe("AdvertisersPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state", () => {
    useAdvertisersSummaryMock.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      refetch: vi.fn(),
    });

    useAdvertisersMock.mockReturnValue({
      data: undefined,
      isLoading: true,
      isFetching: true,
      isError: false,
      refetch: vi.fn(),
    });

    useAdvertiserDetailMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    render(<AdvertisersPage />);

    expect(screen.getByTestId("advertisers-page-loading")).toBeInTheDocument();
  });

  it("renders summary cards and advertiser table rows", async () => {
    mockDefaultState();

    render(<AdvertisersPage />);

    expect(screen.getByText("12,450")).toBeInTheDocument();
    expect(screen.getByText("Binance")).toBeInTheDocument();
    expect(screen.getByText("Telegram Premium")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Showing 2 of 2 advertisers")).toBeInTheDocument();
    });
  });

  it("applies debounced search and industry filters to hook params", async () => {
    mockDefaultState();

    render(<AdvertisersPage />);

    fireEvent.change(screen.getByPlaceholderText("Search advertisers..."), {
      target: { value: "binance" },
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 450));
    });

    const financeTab = screen.getByRole("tab", { name: "Finance" });
    fireEvent.mouseDown(financeTab);
    fireEvent.click(financeTab);

    await waitFor(() => {
      const hasMatchingCall = useAdvertisersMock.mock.calls.some(([params]) => {
        return params.q === "binance" && params.industry_slug === "finance";
      });
      expect(hasMatchingCall).toBe(true);
    });
  });

  it("appends results when load more is clicked", async () => {
    useAdvertisersSummaryMock.mockReturnValue({
      data: summaryPayload,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    useAdvertisersMock.mockImplementation((filters: { cursor?: string }) => ({
      data: filters.cursor ? pageTwo : pageOne,
      isLoading: false,
      isFetching: false,
      isError: false,
      refetch: vi.fn(),
    }));

    useAdvertiserDetailMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    render(<AdvertisersPage />);

    expect(screen.getByText("Binance")).toBeInTheDocument();
    expect(screen.queryByText("Bybit")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Load More" }));

    await waitFor(() => {
      expect(screen.getByText("Bybit")).toBeInTheDocument();
    });
  });

  it("fetches detail for selected advertiser when modal opens", async () => {
    mockDefaultState();

    render(<AdvertisersPage />);

    fireEvent.click(screen.getByRole("button", { name: "Open details for Binance" }));

    await waitFor(() => {
      expect(useAdvertiserDetailMock).toHaveBeenLastCalledWith(
        "2e63db9e-13f7-4204-b8b6-a394f40ca83a",
        true,
      );
    });

    expect(screen.getByText("Global crypto exchange and ecosystem products.")).toBeInTheDocument();
  });

  it("renders error and empty states", async () => {
    useAdvertisersSummaryMock.mockReturnValue({
      data: summaryPayload,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    useAdvertisersMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
      isError: true,
      refetch: vi.fn(),
    });

    useAdvertiserDetailMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    const { rerender } = render(<AdvertisersPage />);
    expect(screen.getByText("Failed to load advertisers.")).toBeInTheDocument();

    useAdvertisersMock.mockReturnValue({
      data: {
        data: [],
        page: { next_cursor: null, has_more: false },
        meta: {
          total_estimate: 0,
          time_period_days: 30,
          snapshot_date: "2026-02-14",
          baseline_date: "2026-01-15",
        },
      },
      isLoading: false,
      isFetching: false,
      isError: false,
      refetch: vi.fn(),
    });

    rerender(<AdvertisersPage />);

    await waitFor(() => {
      expect(screen.getByText("No advertisers found for current filters.")).toBeInTheDocument();
    });
  });
});
