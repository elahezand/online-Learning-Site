import { usePut } from "../../hooks/useReactQueryHooks";
import { useAuth } from "../auth/AuthContext";

export const useMarkNotificationSeen = () => {
  const { refreshUser } = useAuth();

  return usePut(({ id }) => `/notifications/see/${id}`, {
    onSuccess: () => refreshUser(),
    errorFallback: "Failed to update notification",
  });
};