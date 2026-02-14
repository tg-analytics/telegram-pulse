import { useQuery } from "@tanstack/react-query";
import { fetchChannels, ChannelFilters } from "@/services/channelsApi";

export function useChannels(filters: ChannelFilters) {
  return useQuery({
    queryKey: ["channels", filters],
    queryFn: () => fetchChannels(filters),
    staleTime: 30_000,
  });
}
