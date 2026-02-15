import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMembers, inviteMember, removeMember, type InviteMemberPayload } from "@/services/accountApi";

export function useAccountTeam(accountId?: string) {
  const queryClient = useQueryClient();

  const teamQuery = useQuery({
    queryKey: ["account", "team", accountId],
    queryFn: () => fetchMembers(),
    enabled: Boolean(accountId),
    staleTime: 30_000,
  });

  const inviteMemberMutation = useMutation({
    mutationFn: (payload: InviteMemberPayload) => inviteMember(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["account", "team", accountId] });
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: (memberId: string) => removeMember(memberId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["account", "team", accountId] });
    },
  });

  return {
    teamQuery,
    inviteMemberMutation,
    removeMemberMutation,
  };
}
