import { useMemo } from "react";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchBillingUsage,
  fetchInvoiceDownloadUrl,
  fetchInvoices,
  fetchPaymentMethods,
  fetchSubscription,
  updateSubscription,
  type UpdateSubscriptionPayload,
} from "@/services/accountApi";

function getMonthToDateRange() {
  const now = new Date();
  const fromDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const to = now.toISOString().slice(0, 10);
  const from = fromDate.toISOString().slice(0, 10);
  return { from, to };
}

export function useAccountBilling(accountId?: string) {
  const queryClient = useQueryClient();
  const { from, to } = useMemo(() => getMonthToDateRange(), []);

  const subscriptionQuery = useQuery({
    queryKey: ["account", "subscription", accountId],
    queryFn: () => fetchSubscription(accountId as string),
    enabled: Boolean(accountId),
    staleTime: 30_000,
  });

  const usageQuery = useQuery({
    queryKey: ["account", "usage", accountId, from, to],
    queryFn: () => fetchBillingUsage(accountId as string, from, to),
    enabled: Boolean(accountId),
    staleTime: 30_000,
  });

  const paymentMethodsQuery = useQuery({
    queryKey: ["account", "payment-methods", accountId],
    queryFn: () => fetchPaymentMethods(accountId as string),
    enabled: Boolean(accountId),
    staleTime: 30_000,
  });

  const invoicesQuery = useInfiniteQuery({
    queryKey: ["account", "invoices", accountId],
    queryFn: ({ pageParam }) => fetchInvoices(accountId as string, { cursor: pageParam, limit: 20 }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => (lastPage.page.has_more ? lastPage.page.next_cursor : undefined),
    enabled: Boolean(accountId),
    staleTime: 30_000,
  });

  const updateSubscriptionMutation = useMutation({
    mutationFn: (payload: UpdateSubscriptionPayload) => updateSubscription(accountId as string, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["account", "subscription", accountId] });
    },
  });

  const invoiceDownloadMutation = useMutation({
    mutationFn: (invoiceId: string) => fetchInvoiceDownloadUrl(accountId as string, invoiceId),
  });

  const sortedPaymentMethods = useMemo(() => {
    const methods = paymentMethodsQuery.data?.data ?? [];
    return [...methods].sort((a, b) => Number(b.is_default) - Number(a.is_default));
  }, [paymentMethodsQuery.data?.data]);

  return {
    from,
    to,
    subscriptionQuery,
    usageQuery,
    paymentMethodsQuery,
    sortedPaymentMethods,
    invoicesQuery,
    updateSubscriptionMutation,
    invoiceDownloadMutation,
  };
}
