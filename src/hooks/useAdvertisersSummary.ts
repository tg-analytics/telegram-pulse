import { useQuery } from "@tanstack/react-query";
import { fetchAdvertisersSummary } from "@/services/advertisersApi";

export function useAdvertisersSummary(timePeriodDays: number) {
  return useQuery({
    queryKey: ["advertisers-summary", timePeriodDays],
    queryFn: () => fetchAdvertisersSummary(timePeriodDays),
    staleTime: 30_000,
  });
}
