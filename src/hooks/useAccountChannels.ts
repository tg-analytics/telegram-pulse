import { useMemo } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addAccountChannel, fetchAccountChannels, type AddAccountChannelPayload } from "@/services/accountApi";

export function useAccountChannels(accountId?: string) {
  const queryClient = useQueryClient();

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

  const addChannelMutation = useMutation({
    mutationFn: (payload: AddAccountChannelPayload) => addAccountChannel(accountId as string, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["account", "channels", accountId] });
    },
  });

  return {
    channels,
    channelsQuery,
    addChannelMutation,
    hasNextPage: channelsQuery.hasNextPage,
    isFetchingNextPage: channelsQuery.isFetchingNextPage,
    fetchNextPage: channelsQuery.fetchNextPage,
  };
}
