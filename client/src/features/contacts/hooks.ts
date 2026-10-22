import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Contact } from "../../types/models";
import { useGet, usePost, useDelete } from "../../hooks/useReactQueryHooks";

const ENDPOINT = "/contact";
const KEY = ["contacts"];

export const useContacts = () =>
  useGet<Contact[]>(ENDPOINT, undefined, {
    queryKey: KEY,
    errorFallback: "Failed to load messages",
  });

export const useSendContact = (onSuccessCallback?: () => void) =>
  usePost<unknown, { name: string; email: string; phone: string; body: string }>(ENDPOINT, {
    onSuccess: () => {
      toast.success("Your message was sent");
      onSuccessCallback?.();
    },
    errorFallback: "Failed to send message",
  });

export const useAnswerContact = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return usePost<unknown, { email: string; answer: string }>(`${ENDPOINT}/answer`, {
    onSuccess: () => {
      toast.success("Your answer was sent");
      queryClient.invalidateQueries({ queryKey: KEY });
      onSuccessCallback?.();
    },
    errorFallback: "Failed to send answer",
  });
};

export const useDeleteContact = () => {
  const queryClient = useQueryClient();

  return useDelete<unknown, string>((id: string) => `${ENDPOINT}/${id}`, {
    onSuccess: () => {
      toast.success("Message removed");
      queryClient.invalidateQueries({ queryKey: KEY });
    },
    errorFallback: "Failed to remove message",
  });
};
