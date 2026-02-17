import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CatalogShowcase } from "@/components/home/CatalogShowcase";

const useHomeCategoriesMock = vi.fn();

vi.mock("@/hooks/useHomeCategories", () => ({
  useHomeCategories: (...args: unknown[]) => useHomeCategoriesMock(...args),
}));

class IntersectionObserverMock {
  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords() {
    return [];
  }
  root = null;
  rootMargin = "";
  thresholds = [];
}

Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  value: IntersectionObserverMock,
});

function renderShowcase() {
  return render(
    <MemoryRouter>
      <CatalogShowcase />
    </MemoryRouter>,
  );
}

describe("CatalogShowcase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows categories skeleton while loading", () => {
    useHomeCategoriesMock.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    renderShowcase();

    expect(screen.getByTestId("home-categories-skeleton")).toBeInTheDocument();
  });

  it("renders API categories data", () => {
    useHomeCategoriesMock.mockReturnValue({
      data: {
        data: [
          { slug: "art-design", name: "Art & Design", icon: "palette", channels_count: 62800 },
        ],
        page: {
          next_cursor: null,
          has_more: false,
        },
        meta: {
          total_estimate: 1,
        },
      },
      isLoading: false,
      isError: false,
    });

    renderShowcase();

    expect(useHomeCategoriesMock).toHaveBeenCalledWith(50);
    expect(screen.getByText("Art & Design")).toBeInTheDocument();
    expect(screen.getByText("62.8k")).toBeInTheDocument();
  });

  it("falls back to static categories when API fails and no data exists", () => {
    useHomeCategoriesMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });

    renderShowcase();

    expect(screen.getByText("Technologies")).toBeInTheDocument();
    expect(screen.getByText("63.7k")).toBeInTheDocument();
  });
});
