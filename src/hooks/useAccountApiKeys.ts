import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createApiKey,
  fetchApiKeys,
  fetchApiUsage,
  revokeApiKey,
  type ApiKey,
  type CreateApiKeyPayload,
} from "@/services/accountApi";

function getMonthToDateRange() {
  const now = new Date();
  const fromDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const to = now.toISOString().slice(0, 10);
  const from = fromDate.toISOString().slice(0, 10);
  return { from, to };
}

export function useAccountApiKeys(accountId?: string) {
  const queryClient = useQueryClient();
  const { from, to } = useMemo(() => getMonthToDateRange(), []);

  const apiKeysQuery = useQuery({
    queryKey: ["account", "api-keys", accountId],
    queryFn: () => fetchApiKeys(accountId as string),
    enabled: Boolean(accountId),
    staleTime: 30_000,
  });

  const activeApiKeys: ApiKey[] = useMemo(
    () => (apiKeysQuery.data?.data ?? []).filter((key) => !key.revoked_at),
    [apiKeysQuery.data?.data],
  );

  const apiUsageQuery = useQuery({
    queryKey: ["account", "api-usage", accountId, from, to],
    queryFn: () => fetchApiUsage(accountId as string, from, to),
    enabled: Boolean(accountId),
    staleTime: 30_000,
  });

  const createApiKeyMutation = useMutation({
    mutationFn: (payload: CreateApiKeyPayload) => createApiKey(accountId as string, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["account", "api-keys", accountId] }),
        queryClient.invalidateQueries({ queryKey: ["account", "api-usage", accountId] }),
      ]);
    },
  });

  const revokeApiKeyMutation = useMutation({
    mutationFn: (apiKeyId: string) => revokeApiKey(accountId as string, apiKeyId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["account", "api-keys", accountId] });
    },
  });

  return {
    from,
    to,
    apiKeysQuery,
    apiUsageQuery,
    activeApiKeys,
    createApiKeyMutation,
    revokeApiKeyMutation,
  };
}
