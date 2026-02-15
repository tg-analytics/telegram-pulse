import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchMe,
  fetchNotifications,
  fetchPreferences,
  updateMe,
  updateNotifications,
  updatePreferences,
  type Notifications,
  type Preferences,
  type UpdateMePayload,
} from "@/services/accountApi";

export function useAccountProfile() {
  const queryClient = useQueryClient();

  const meQuery = useQuery({
    queryKey: ["account", "me"],
    queryFn: fetchMe,
    staleTime: 30_000,
  });

  const preferencesQuery = useQuery({
    queryKey: ["account", "preferences"],
    queryFn: fetchPreferences,
    staleTime: 30_000,
  });

  const notificationsQuery = useQuery({
    queryKey: ["account", "notifications"],
    queryFn: fetchNotifications,
    staleTime: 30_000,
  });

  const updateMeMutation = useMutation({
    mutationFn: (payload: UpdateMePayload) => updateMe(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["account", "me"] });
    },
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: (payload: Preferences) => updatePreferences(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["account", "preferences"] });
    },
  });

  const updateNotificationsMutation = useMutation({
    mutationFn: (payload: Notifications) => updateNotifications(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["account", "notifications"] });
    },
  });

  return {
    meQuery,
    preferencesQuery,
    notificationsQuery,
    updateMeMutation,
    updatePreferencesMutation,
    updateNotificationsMutation,
  };
}
