import { useQuery } from "@tanstack/react-query";
import { fetchTrackers, type TrackerFilters } from "@/services/trackersApi";

export function useTrackers(accountId?: string, filters: TrackerFilters = {}) {
  return useQuery({
    queryKey: ["trackers", accountId, filters],
    queryFn: () => fetchTrackers(accountId as string, filters),
    enabled: Boolean(accountId),
    staleTime: 30_000,
  });
}
