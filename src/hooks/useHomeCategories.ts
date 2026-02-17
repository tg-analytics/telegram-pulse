import { useQuery } from "@tanstack/react-query";
import {
  fetchHomeCategoriesCached,
  HOME_CATEGORIES_TTL_MS,
} from "@/services/homeApi";

export function useHomeCategories(limit = 50) {
  return useQuery({
    queryKey: ["home", "categories", limit],
    queryFn: () => fetchHomeCategoriesCached({ limit }),
    staleTime: HOME_CATEGORIES_TTL_MS,
    gcTime: HOME_CATEGORIES_TTL_MS,
  });
}
