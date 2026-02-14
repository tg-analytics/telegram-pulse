import { useQuery } from "@tanstack/react-query";
import { fetchMiniAppsSummary, MiniAppsSummaryPeriod } from "@/services/miniAppsApi";

export function useMiniAppsSummary(period: MiniAppsSummaryPeriod) {
  return useQuery({
    queryKey: ["mini-apps-summary", period],
    queryFn: () => fetchMiniAppsSummary(period),
    staleTime: 30_000,
  });
}
