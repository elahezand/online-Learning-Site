import { toast } from "sonner";
import { usePost } from "../../hooks/useReactQueryHooks";

export const useSubscribeNewsletter = (onSuccessCallback?: () => void) =>
  usePost<unknown, { email: string }>("/newsletters", {
    onSuccess: () => {
      toast.success("You have subscribed to the newsletter :)");
      onSuccessCallback?.();
    },
    errorFallback: "Subscription failed",
  });