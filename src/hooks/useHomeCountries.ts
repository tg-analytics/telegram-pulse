import { useQuery } from "@tanstack/react-query";
import {
  fetchHomeCountriesCached,
  HOME_COUNTRIES_TTL_MS,
} from "@/services/homeApi";

export function useHomeCountries(limit = 50) {
  return useQuery({
    queryKey: ["home", "countries", limit],
    queryFn: () => fetchHomeCountriesCached({ limit }),
    staleTime: HOME_COUNTRIES_TTL_MS,
    gcTime: HOME_COUNTRIES_TTL_MS,
  });
}
