import { useQuery } from "@tanstack/react-query";
import { fetchTrackerMentions, type TrackerMentionsParams } from "@/services/trackersApi";

export function useTrackerMentions(accountId?: string, params: TrackerMentionsParams = {}) {
  return useQuery({
    queryKey: ["tracker-mentions", accountId, params],
    queryFn: () => fetchTrackerMentions(accountId as string, params),
    enabled: Boolean(accountId),
    staleTime: 0,
    refetchInterval: 60_000,
  });
}
