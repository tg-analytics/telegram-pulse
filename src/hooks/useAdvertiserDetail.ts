import { useQuery } from "@tanstack/react-query";
import { fetchAdvertiserDetail } from "@/services/advertisersApi";

export function useAdvertiserDetail(advertiserId?: string, enabled = true) {
  return useQuery({
    queryKey: ["advertiser-detail", advertiserId],
    queryFn: () => fetchAdvertiserDetail(advertiserId as string),
    enabled: Boolean(advertiserId) && enabled,
    staleTime: 30_000,
  });
}
