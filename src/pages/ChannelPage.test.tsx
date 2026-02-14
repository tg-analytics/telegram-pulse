import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ChannelPage from "@/pages/ChannelPage";

const useChannelOverviewMock = vi.fn();

vi.mock("@/hooks/useChannelOverview", () => ({
  useChannelOverview: (...args: unknown[]) => useChannelOverviewMock(...args),
}));

vi.mock("@/components/layout/MainLayout", () => ({
  MainLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("recharts", () => {
  const Container = ({ children }: { children?: React.ReactNode }) => <div>{children}</div>;
  const SvgMock = ({ children }: { children?: React.ReactNode }) => (
    <svg role="img" aria-label="chart-mock">
      {children}
    </svg>
  );
  return {
    ResponsiveContainer: Container,
    ComposedChart: SvgMock,
    CartesianGrid: () => null,
    XAxis: () => null,
    YAxis: () => null,
    Tooltip: () => null,
    Area: () => null,
    Line: () => null,
  };
});

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/channel/9f28253d-8ffd-4d2f-a67c-ebaf0f6ba2f2"]}>
      <Routes>
        <Route path="/channel/:id" element={<ChannelPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

const overviewPayload = {
  data: {
    channel: {
      channel_id: "9f28253d-8ffd-4d2f-a67c-ebaf0f6ba2f2",
      telegram_channel_id: 100001,
      name: "Tech News Daily",
      username: "@technewsdaily",
      avatar_url: null,
      description: "Channel description",
      about_text: "Channel about",
      website_url: null,
      status: "verified",
      country_code: "US",
      category_slug: "technology",
      category_name: "Technology",
    },
    kpis: {
      subscribers: { value: 5430000, delta: 156000, delta_percent: 2.96 },
      avg_views: { value: 1780000, delta: 42000, delta_percent: 2.42 },
      engagement_rate: { value: 3.2, delta: 0.3, delta_percent: 10.34 },
      posts_per_day: { value: 4.2, delta: -0.5, delta_percent: -10.64 },
    },
    chart: {
      range: "30d",
      points: [
        { date: "2026-01-16", subscribers: 5274000, engagement_rate: 2.9 },
        { date: "2026-02-14", subscribers: 5430000, engagement_rate: 3.2 },
      ],
    },
    similar_channels: [
      {
        channel_id: "e7db20e8-a039-4f6f-bf2e-6f3b8ebf2ea0",
        name: "Crypto Insights",
        username: "@cryptoinsights",
        subscribers: 1800000,
        similarity_score: 0.82,
      },
    ],
    tags: [
      { tag_id: "b89f2", slug: "technology", name: "Technology", relevance_score: 92.5 },
    ],
    recent_posts: [
      {
        post_id: "3522a9ea-0c50-4eb1-9053-8a7e0b74f4d3",
        telegram_message_id: 9001,
        published_at: "2026-02-14T10:00:00Z",
        title: "Breaking: New AI model released",
        content_text: "New AI model released with unprecedented capabilities.",
        views_count: 125000,
        reactions_count: 4200,
        comments_count: 640,
        forwards_count: 1800,
        external_post_url: "https://t.me/technewsdaily/9001",
      },
    ],
    inout_30d: { incoming: 12500, outgoing: 3200 },
    incoming_30d: 12500,
    outgoing_30d: 3200,
  },
  meta: {},
};

describe("ChannelPage", () => {
  it("renders loading skeleton while overview query is pending", () => {
    useChannelOverviewMock.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      refetch: vi.fn(),
    });

    renderPage();

    expect(screen.getByTestId("channel-page-skeleton")).toBeInTheDocument();
  });

  it("renders blocking error state and retry button on failure", () => {
    const refetch = vi.fn();
    useChannelOverviewMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch,
    });

    renderPage();

    expect(screen.getByText("Failed to load channel overview")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });

  it("renders live overview data and keeps views toggle disabled", () => {
    useChannelOverviewMock.mockReturnValue({
      data: overviewPayload,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    renderPage();

    expect(screen.getByText("Tech News Daily")).toBeInTheDocument();
    expect(screen.getByText("Breaking: New AI model released")).toBeInTheDocument();

    const viewsButton = screen.getByRole("button", { name: /views/i });
    expect(viewsButton).toBeDisabled();

    const similarLink = screen.getByRole("link", { name: /crypto insights/i });
    expect(similarLink).toHaveAttribute("href", "/channel/e7db20e8-a039-4f6f-bf2e-6f3b8ebf2ea0");
  });
});
