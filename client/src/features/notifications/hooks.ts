import { usePut } from "../../hooks/useReactQueryHooks";
import { useAuth } from "../auth/useAuth";

export const useMarkNotificationSeen = () => {
  const { refreshUser } = useAuth();

  return usePut<unknown, { id: string }>(({ id }) => `/notifications/see/${id}`, {
    onSuccess: () => refreshUser(),
    errorFallback: "Failed to update notification",
  });
};