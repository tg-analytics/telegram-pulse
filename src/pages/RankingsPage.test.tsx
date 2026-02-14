import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RankingsPage from "@/pages/RankingsPage";

const useCountryRankingsMock = vi.fn();
const useCategoryRankingsMock = vi.fn();
const useRankingCollectionsMock = vi.fn();

vi.mock("@/hooks/useRankings", () => ({
  useCountryRankings: (...args: unknown[]) => useCountryRankingsMock(...args),
  useCategoryRankings: (...args: unknown[]) => useCategoryRankingsMock(...args),
  useRankingCollections: (...args: unknown[]) => useRankingCollectionsMock(...args),
}));

vi.mock("@/components/layout/MainLayout", () => ({
  MainLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/ui/tabs", () => ({
  Tabs: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TabsList: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TabsTrigger: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
  TabsContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

function buildSuccessData() {
  return {
    country: {
      data: [
        {
          rank: 1,
          channel_id: "9f28253d-8ffd-4d2f-a67c-ebaf0f6ba2f2",
          name: "Tech News Daily",
          username: "@technewsdaily",
          subscribers: 2100000,
          growth_7d: 8.2,
          engagement_rate: 4.8,
          context_type: "country" as const,
          context_label: "United States",
          trend_label: "growth_7d",
          trend_value: 8.2,
        },
      ],
      meta: {
        country_code: "US",
        country_name: "United States",
        snapshot_date: "2026-02-14",
        total_ranked_channels: 83,
        applied_limit: 10,
      },
    },
    category: {
      data: [
        {
          rank: 1,
          channel_id: "0b4f1ef1-30e3-47f0-89f1-5cf25114ba3b",
          name: "AI Weekly",
          username: "@aiweekly",
          subscribers: 1400000,
          growth_7d: 6.1,
          engagement_rate: 5.2,
          context_type: "category" as const,
          context_label: "Technology",
          trend_label: "engagement_rate",
          trend_value: 5.2,
        },
      ],
      meta: {
        category_slug: "technology",
        category_name: "Technology",
        snapshot_date: "2026-02-14",
        total_ranked_channels: 41,
        applied_limit: 10,
      },
    },
    collections: {
      data: [
        {
          collection_id: "8fa793e5-c3b9-4140-a498-08d842d2862f",
          slug: "crypto-blockchain",
          name: "Crypto & Blockchain",
          description: "Top channels in crypto markets and blockchain ecosystems.",
          icon: "💎",
          channels_count: 2450,
          cta_label: "Explore",
          cta_target: "/rankings/collections/8fa793e5-c3b9-4140-a498-08d842d2862f/channels",
        },
      ],
      meta: {
        total_active_collections: 6,
        applied_limit: 20,
      },
    },
  };
}

function renderPage() {
  return render(
    <MemoryRouter>
      <RankingsPage />
    </MemoryRouter>,
  );
}

describe("RankingsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const data = buildSuccessData();

    useCountryRankingsMock.mockReturnValue({
      data: data.country,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    useCategoryRankingsMock.mockReturnValue({
      data: data.category,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    useRankingCollectionsMock.mockReturnValue({
      data: data.collections,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });
  });

  it("renders loading placeholders", () => {
    useCountryRankingsMock.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      refetch: vi.fn(),
    });

    useCategoryRankingsMock.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      refetch: vi.fn(),
    });

    useRankingCollectionsMock.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      refetch: vi.fn(),
    });

    renderPage();
    expect(screen.getByTestId("country-rankings-skeleton")).toBeInTheDocument();
  });

  it("renders country rows from API data", () => {
    renderPage();
    expect(screen.getByText("Tech News Daily")).toBeInTheDocument();
    expect(screen.getByText("+8.2%")).toBeInTheDocument();
  });

  it("renders category rows from API data", () => {
    renderPage();
    expect(screen.getByText("AI Weekly")).toBeInTheDocument();
    expect(screen.getByText("+5.2%")).toBeInTheDocument();
  });

  it("renders collection cards and cta_target links", () => {
    renderPage();

    const collectionLink = screen.getByRole("link", { name: /Crypto & Blockchain/i });
    expect(collectionLink).toHaveAttribute(
      "href",
      "/rankings/collections/8fa793e5-c3b9-4140-a498-08d842d2862f/channels",
    );
  });

  it("shows per-tab error state", () => {
    useCountryRankingsMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch: vi.fn(),
    });

    renderPage();
    expect(screen.getByTestId("country-rankings-error")).toBeInTheDocument();
    expect(screen.getByText("Failed to load country rankings.")).toBeInTheDocument();
  });

  it("shows empty state when API returns no data", () => {
    useCountryRankingsMock.mockReturnValue({
      data: {
        data: [],
        meta: {
          country_code: "US",
          country_name: "United States",
          snapshot_date: "2026-02-14",
          total_ranked_channels: 0,
          applied_limit: 10,
        },
      },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    renderPage();
    expect(screen.getByTestId("country-rankings-empty")).toBeInTheDocument();
    expect(screen.getByText("No rankings available.")).toBeInTheDocument();
  });
});
