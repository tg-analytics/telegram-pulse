import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import MiniAppsPage from "@/pages/MiniAppsPage";

const useMiniAppsSummaryMock = vi.fn();
const useMiniAppsMock = vi.fn();

vi.mock("@/hooks/useMiniAppsSummary", () => ({
  useMiniAppsSummary: (...args: unknown[]) => useMiniAppsSummaryMock(...args),
}));

vi.mock("@/hooks/useMiniApps", () => ({
  useMiniApps: (...args: unknown[]) => useMiniAppsMock(...args),
}));

vi.mock("@/components/layout/MainLayout", () => ({
  MainLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const summaryPayload = {
  data: {
    total_mini_apps: 4412,
    daily_active_users: 28500000,
    total_sessions: 156000000,
    avg_session_seconds: 272,
    total_mini_apps_delta: 127,
    daily_active_users_delta: 3140000,
    daily_active_users_delta_percent: 12.38,
    total_sessions_delta: 12400000,
    total_sessions_delta_percent: 8.64,
    avg_session_seconds_delta: 18,
  },
  meta: {},
};

const pageOne = {
  data: [
    {
      mini_app_id: "1",
      name: "Hamster Kombat",
      slug: "hamster-kombat",
      category_slug: "games",
      daily_users: 2500000,
      total_users: 45000000,
      sessions: 98000000,
      rating: 4.8,
      growth_weekly: 15.2,
      launched_at: "2025-06-19",
    },
  ],
  page: {
    next_cursor: "cursor-2",
    has_more: true,
  },
  meta: {
    total_estimate: 2,
  },
};

const pageTwo = {
  data: [
    {
      mini_app_id: "2",
      name: "Wallet",
      slug: "wallet",
      category_slug: "finance",
      daily_users: 1200000,
      total_users: 28000000,
      sessions: 54000000,
      rating: 4.9,
      growth_weekly: 22.3,
      launched_at: "2025-10-22",
    },
  ],
  page: {
    next_cursor: null,
    has_more: false,
  },
  meta: {
    total_estimate: 2,
  },
};

function mockSuccessState() {
  useMiniAppsSummaryMock.mockReturnValue({
    data: summaryPayload,
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
  });

  useMiniAppsMock.mockImplementation((filters: { cursor?: string }) => ({
    data: filters.cursor ? pageTwo : pageOne,
    isLoading: false,
    isFetching: false,
    isError: false,
    refetch: vi.fn(),
  }));
}

describe("MiniAppsPage", () => {
  it("renders loading state", () => {
    useMiniAppsSummaryMock.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      refetch: vi.fn(),
    });
    useMiniAppsMock.mockReturnValue({
      data: undefined,
      isLoading: true,
      isFetching: true,
      isError: false,
      refetch: vi.fn(),
    });

    render(<MiniAppsPage />);

    expect(screen.getByTestId("mini-apps-page-loading")).toBeInTheDocument();
  });

  it("renders error states and retry buttons", () => {
    useMiniAppsSummaryMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch: vi.fn(),
    });
    useMiniAppsMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
      isError: true,
      refetch: vi.fn(),
    });

    render(<MiniAppsPage />);

    expect(screen.getByText("Failed to load mini-app summary.")).toBeInTheDocument();
    expect(screen.getByText("Failed to load mini apps.")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Retry" })).toHaveLength(2);
  });

  it("renders API list data in grid and list modes", async () => {
    mockSuccessState();

    render(<MiniAppsPage />);

    expect(screen.getByText("Hamster Kombat")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "List view" }));

    await waitFor(() => {
      expect(screen.getByText("/hamster-kombat")).toBeInTheDocument();
    });
  });

  it("applies search and category filters to hook params", async () => {
    mockSuccessState();

    render(<MiniAppsPage />);

    const search = screen.getByPlaceholderText("Search mini apps...");
    fireEvent.change(search, { target: { value: "wallet" } });

    fireEvent.click(screen.getByTestId("category-tab-finance"));

    await waitFor(() => {
      const lastCall = useMiniAppsMock.mock.calls.at(-1)?.[0];
      expect(lastCall.q).toBe("wallet");
      expect(lastCall.category_slug).toBe("finance");
    });
  });

  it("appends results when load more is clicked", async () => {
    mockSuccessState();

    render(<MiniAppsPage />);

    expect(screen.getByText("Hamster Kombat")).toBeInTheDocument();
    expect(screen.queryByText("Wallet")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Load More" }));

    await waitFor(() => {
      expect(screen.getByText("Wallet")).toBeInTheDocument();
    });

    expect(screen.getByText("Showing 2 of 2 mini apps")).toBeInTheDocument();
  });

  it("changes summary period via selector buttons", async () => {
    mockSuccessState();

    render(<MiniAppsPage />);

    fireEvent.click(screen.getByRole("button", { name: "30d" }));

    await waitFor(() => {
      expect(useMiniAppsSummaryMock).toHaveBeenLastCalledWith("30d");
    });
  });
});
