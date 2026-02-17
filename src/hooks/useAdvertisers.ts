import { useQuery } from "@tanstack/react-query";
import { AdvertisersFilters, fetchAdvertisers } from "@/services/advertisersApi";

export function useAdvertisers(filters: AdvertisersFilters) {
  return useQuery({
    queryKey: ["advertisers", filters],
    queryFn: () => fetchAdvertisers(filters),
    staleTime: 30_000,
  });
}
