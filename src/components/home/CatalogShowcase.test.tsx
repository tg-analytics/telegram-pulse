import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CatalogShowcase } from "@/components/home/CatalogShowcase";

const useHomeCategoriesMock = vi.fn();
const useHomeCountriesMock = vi.fn();

vi.mock("@/hooks/useHomeCategories", () => ({
  useHomeCategories: (...args: unknown[]) => useHomeCategoriesMock(...args),
}));

vi.mock("@/hooks/useHomeCountries", () => ({
  useHomeCountries: (...args: unknown[]) => useHomeCountriesMock(...args),
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

    useHomeCategoriesMock.mockReturnValue({
      data: {
        data: [{ slug: "default", name: "Default category", icon: "box", channels_count: 1 }],
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

    useHomeCountriesMock.mockReturnValue({
      data: {
        data: [{ code: "US", name: "United States", flag_emoji: "🇺🇸", channels_count: 1 }],
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

  it("shows countries skeleton while loading", () => {
    useHomeCountriesMock.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    renderShowcase();

    expect(screen.getByTestId("home-countries-skeleton")).toBeInTheDocument();
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

  it("renders API countries data", () => {
    useHomeCountriesMock.mockReturnValue({
      data: {
        data: [
          { code: "AZ", name: "Azerbaijan", flag_emoji: "🇦🇿", channels_count: 3600 },
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

    expect(useHomeCountriesMock).toHaveBeenCalledWith(50);
    expect(screen.getByText("Azerbaijan")).toBeInTheDocument();
    expect(screen.getByText("🇦🇿")).toBeInTheDocument();
    expect(screen.getByText("3.6k")).toBeInTheDocument();
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

  it("falls back to static countries when API fails and no data exists", () => {
    useHomeCountriesMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });

    renderShowcase();

    expect(screen.getByText("Saudi Arabia")).toBeInTheDocument();
    expect(screen.getByText("66.4k")).toBeInTheDocument();
  });
});
