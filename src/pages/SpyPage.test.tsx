import React from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SpyPage from "@/pages/SpyPage";

const useAuthMock = vi.fn();
const useTrackersMock = vi.fn();
const useTrackerMentionsMock = vi.fn();
const toastMock = vi.fn();

const createTrackerMock = vi.fn();
const fetchTrackerMock = vi.fn();
const updateTrackerMock = vi.fn();
const deleteTrackerMock = vi.fn();

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => useAuthMock(),
}));

vi.mock("@/hooks/useTrackers", () => ({
  useTrackers: (...args: unknown[]) => useTrackersMock(...args),
}));

vi.mock("@/hooks/useTrackerMentions", () => ({
  useTrackerMentions: (...args: unknown[]) => useTrackerMentionsMock(...args),
}));

vi.mock("@/components/ui/use-toast", () => ({
  useToast: () => ({ toast: toastMock }),
}));

vi.mock("@/components/layout/MainLayout", () => ({
  MainLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/services/trackersApi", async () => {
  const actual = await vi.importActual("@/services/trackersApi");
  return {
    ...actual,
    createTracker: (...args: unknown[]) => createTrackerMock(...args),
    fetchTracker: (...args: unknown[]) => fetchTrackerMock(...args),
    updateTracker: (...args: unknown[]) => updateTrackerMock(...args),
    deleteTracker: (...args: unknown[]) => deleteTrackerMock(...args),
  };
});

vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuItem: ({ children, onClick, disabled, className }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean; className?: string }) => (
    <button type="button" onClick={onClick} disabled={disabled} className={className}>
      {children}
    </button>
  ),
}));

vi.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
  DialogDescription: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
  DialogFooter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/ui/tabs", () => ({
  Tabs: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TabsList: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TabsTrigger: ({ children }: { children: React.ReactNode }) => <button type="button">{children}</button>,
  TabsContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const trackerData = {
  data: [
    {
      tracker_id: "t-1",
      account_id: "acc-1",
      tracker_type: "keyword",
      tracker_value: "bitcoin price",
      status: "active",
      mentions_count: 12,
      last_activity_at: "2026-02-14T20:11:00Z",
      notify_push: true,
      notify_telegram: true,
      notify_email: false,
    },
    {
      tracker_id: "t-2",
      account_id: "acc-1",
      tracker_type: "channel",
      tracker_value: "@technewsdaily",
      status: "paused",
      mentions_count: 5,
      last_activity_at: "2026-02-14T13:20:00Z",
      notify_push: true,
      notify_telegram: true,
      notify_email: true,
    },
  ],
  meta: {},
};

const mentionsData = {
  data: [
    {
      mention_id: "m-1",
      tracker_id: "t-1",
      mention_seq: 100003,
      channel_id: "c-1",
      channel_name: "Tech News Daily",
      post_id: "p-1",
      mention_text: "bitcoin price",
      context_snippet: "Analysts expect more volatility in bitcoin price this week.",
      mentioned_at: "2026-02-14T20:00:00Z",
    },
  ],
  page: {
    next_cursor: null,
    has_more: false,
  },
  meta: {},
};

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <SpyPage />
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  useAuthMock.mockReturnValue({
    session: { account_id: "acc-1" },
  });

  useTrackersMock.mockReturnValue({
    data: trackerData,
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
  });

  useTrackerMentionsMock.mockReturnValue({
    data: mentionsData,
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
  });

  createTrackerMock.mockResolvedValue({ data: { tracker_id: "t-3" }, meta: {} });
  fetchTrackerMock.mockResolvedValue({
    data: {
      tracker_id: "t-1",
      account_id: "acc-1",
      tracker_type: "keyword",
      tracker_value: "bitcoin price",
      status: "active",
      mentions_count: 12,
      last_activity_at: "2026-02-14T20:11:00Z",
      notify_push: true,
      notify_telegram: true,
      notify_email: false,
    },
    meta: {},
  });
  updateTrackerMock.mockResolvedValue({ data: { tracker_id: "t-1", status: "paused" }, meta: {} });
  deleteTrackerMock.mockResolvedValue(undefined);
});

describe("SpyPage", () => {
  it("renders API trackers and mentions", () => {
    renderPage();

    expect(screen.getAllByText("bitcoin price").length).toBeGreaterThan(0);
    expect(screen.getByText("@technewsdaily")).toBeInTheDocument();
    expect(screen.getByText("Analysts expect more volatility in bitcoin price this week.")).toBeInTheDocument();
    expect(useTrackerMentionsMock).toHaveBeenCalledWith("acc-1", { limit: 50 });
  });

  it("shows Pause for active and Resume for paused trackers", () => {
    renderPage();

    expect(screen.getByRole("button", { name: /pause/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /resume/i })).toBeInTheDocument();
  });

  it("sends PATCH with paused status when Pause is clicked", async () => {
    renderPage();

    fireEvent.click(screen.getByRole("button", { name: /pause/i }));

    await waitFor(() => {
      expect(updateTrackerMock).toHaveBeenCalledWith("acc-1", "t-1", { status: "paused" });
    });
  });

  it("loads tracker by id before opening edit dialog", async () => {
    renderPage();

    fireEvent.click(screen.getAllByRole("button", { name: /edit/i })[0]);

    await waitFor(() => {
      expect(fetchTrackerMock).toHaveBeenCalledWith("acc-1", "t-1");
    });
  });

  it("submits create payload including notify_email", async () => {
    renderPage();

    const input = screen.getByPlaceholderText("e.g., bitcoin price, AI news");
    fireEvent.change(input, { target: { value: "AI breakthrough" } });

    fireEvent.click(screen.getByRole("button", { name: "Create Tracker" }));

    await waitFor(() => {
      expect(createTrackerMock).toHaveBeenCalledWith("acc-1", {
        tracker_type: "keyword",
        tracker_value: "AI breakthrough",
        notify_push: true,
        notify_telegram: true,
        notify_email: false,
      });
    });
  });

  it("deletes tracker when Delete is clicked", async () => {
    renderPage();

    fireEvent.click(screen.getAllByRole("button", { name: /delete/i })[0]);

    await waitFor(() => {
      expect(deleteTrackerMock).toHaveBeenCalledWith("acc-1", "t-1");
    });
  });

  it("renders error banner and retry", () => {
    const trackersRefetch = vi.fn();
    const mentionsRefetch = vi.fn();

    useTrackersMock.mockReturnValueOnce({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error("Trackers failed"),
      refetch: trackersRefetch,
    });

    useTrackerMentionsMock.mockReturnValueOnce({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error("Mentions failed"),
      refetch: mentionsRefetch,
    });

    renderPage();

    expect(screen.getByText(/Failed to load event tracking data/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(trackersRefetch).toHaveBeenCalled();
    expect(mentionsRefetch).toHaveBeenCalled();
  });

  it("renders skeletons while data is loading", () => {
    useTrackersMock.mockReturnValueOnce({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    useTrackerMentionsMock.mockReturnValueOnce({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    renderPage();

    expect(screen.getByTestId("spy-page-trackers-loading")).toBeInTheDocument();
    expect(screen.getByTestId("spy-page-mentions-loading")).toBeInTheDocument();
  });
});
