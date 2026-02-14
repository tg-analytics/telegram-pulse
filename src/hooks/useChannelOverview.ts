import { useQuery } from "@tanstack/react-query";
import { fetchChannelOverview } from "@/services/channelsApi";

export function useChannelOverview(channelId?: string) {
  return useQuery({
    queryKey: ["channelOverview", channelId],
    queryFn: () => fetchChannelOverview(channelId as string),
    enabled: Boolean(channelId),
    staleTime: 30_000,
  });
}
