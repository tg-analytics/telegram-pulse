import { useQuery } from "@tanstack/react-query";
import { fetchMiniApps, MiniAppsFilters } from "@/services/miniAppsApi";

export function useMiniApps(filters: MiniAppsFilters) {
  return useQuery({
    queryKey: ["mini-apps", filters],
    queryFn: () => fetchMiniApps(filters),
    staleTime: 30_000,
  });
}
