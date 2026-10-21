import { toast } from "sonner";
import { usePost } from "../../hooks/useReactQueryHooks";

export const useSubscribeNewsletter = (onSuccessCallback) =>
  usePost("/newsletters", {
    onSuccess: () => {
      toast.success("You have subscribed to the newsletter :)");
      onSuccessCallback?.();
    },
    errorFallback: "Subscription failed",
  });