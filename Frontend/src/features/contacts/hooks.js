import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useGet, usePost, useDelete } from "../../hooks/useReactQueryHooks";

const ENDPOINT = "/contact";
const KEY = ["contacts"];

/* ---------- GET ---------- */

export const useContacts = () =>
  useGet(ENDPOINT, undefined, {
    queryKey: KEY,
    errorFallback: "Failed to load messages",
  });

/* ---------- POST ---------- */

export const useSendContact = (onSuccessCallback) =>
  usePost(ENDPOINT, {
    onSuccess: () => {
      toast.success("Your message was sent");
      onSuccessCallback?.();
    },
    errorFallback: "Failed to send message",
  });

export const useAnswerContact = (onSuccessCallback) => {
  const queryClient = useQueryClient();

  return usePost(`${ENDPOINT}/answer`, {
    onSuccess: () => {
      toast.success("Your answer was sent");
      queryClient.invalidateQueries({ queryKey: KEY });
      onSuccessCallback?.();
    },
    errorFallback: "Failed to send answer",
  });
};

/* ---------- DELETE ---------- */

export const useDeleteContact = () => {
  const queryClient = useQueryClient();

  return useDelete((id) => `${ENDPOINT}/${id}`, {
    onSuccess: () => {
      toast.success("Message removed");
      queryClient.invalidateQueries({ queryKey: KEY });
    },
    errorFallback: "Failed to remove message",
  });
};