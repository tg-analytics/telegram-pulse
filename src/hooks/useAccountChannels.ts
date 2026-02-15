import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchAccountChannels } from "@/services/accountApi";

export function useAccountChannels(accountId?: string) {
  const channelsQuery = useInfiniteQuery({
    queryKey: ["account", "channels", accountId],
    queryFn: ({ pageParam }) =>
      fetchAccountChannels(accountId as string, {
        limit: 20,
        cursor: pageParam,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => (lastPage.page.has_more ? lastPage.page.next_cursor ?? undefined : undefined),
    enabled: Boolean(accountId),
    staleTime: 30_000,
  });

  const channels = useMemo(
    () => channelsQuery.data?.pages.flatMap((page) => page.data) ?? [],
    [channelsQuery.data?.pages],
  );

  return {
    channels,
    channelsQuery,
    hasNextPage: channelsQuery.hasNextPage,
    isFetchingNextPage: channelsQuery.isFetchingNextPage,
    fetchNextPage: channelsQuery.fetchNextPage,
  };
}
