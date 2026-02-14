import { useQuery } from "@tanstack/react-query";
import {
  fetchCategoryRankings,
  fetchCountryRankings,
  fetchRankingCollections,
} from "@/services/channelsApi";

export function useCountryRankings(countryCode = "US", limit = 10) {
  return useQuery({
    queryKey: ["rankings", "countries", countryCode, limit],
    queryFn: () => fetchCountryRankings({ country_code: countryCode, limit }),
    staleTime: 30_000,
  });
}

export function useCategoryRankings(categorySlug = "technology", limit = 10) {
  return useQuery({
    queryKey: ["rankings", "categories", categorySlug, limit],
    queryFn: () => fetchCategoryRankings({ category_slug: categorySlug, limit }),
    staleTime: 30_000,
  });
}

export function useRankingCollections(limit = 20) {
  return useQuery({
    queryKey: ["rankings", "collections", limit],
    queryFn: () => fetchRankingCollections({ limit }),
    staleTime: 30_000,
  });
}
