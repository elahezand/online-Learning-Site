import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useGet, usePost, usePut, useDelete } from "../../hooks/useReactQueryHooks";

const ENDPOINT = "/comments";
const KEY = ["comments"];

/* ---------- GET ---------- */

export const useComments = () =>
  useGet(ENDPOINT, undefined, {
    queryKey: KEY,
    errorFallback: "Failed to load comments",
  });

/* ---------- POST ---------- */

export const useCreateComment = (onSuccessCallback) =>
  usePost(ENDPOINT, {
    onSuccess: () => {
      toast.success("Your comment was sent and will be shown after approval");
      onSuccessCallback?.();
    },
    errorFallback: "Failed to send comment",
  });

export const useAnswerComment = (onSuccessCallback) => {
  const queryClient = useQueryClient();

  return usePost(({ id }) => `${ENDPOINT}/answer/${id}`, {
    onSuccess: () => {
      toast.success("Your answer was sent");
      queryClient.invalidateQueries({ queryKey: KEY });
      onSuccessCallback?.();
    },
    errorFallback: "Failed to send answer",
  });
};

/* ---------- PUT ---------- */

export const useAcceptComment = () => {
  const queryClient = useQueryClient();

  return usePut(({ id }) => `${ENDPOINT}/accept/${id}`, {
    onSuccess: () => {
      toast.success("Comment accepted");
      queryClient.invalidateQueries({ queryKey: KEY });
    },
    errorFallback: "Failed to accept comment",
  });
};

export const useRejectComment = () => {
  const queryClient = useQueryClient();

  return usePut(({ id }) => `${ENDPOINT}/reject/${id}`, {
    onSuccess: () => {
      toast.success("Comment rejected");
      queryClient.invalidateQueries({ queryKey: KEY });
    },
    errorFallback: "Failed to reject comment",
  });
};

/* ---------- DELETE ---------- */

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useDelete((id) => `${ENDPOINT}/${id}`, {
    onSuccess: () => {
      toast.success("Comment removed");
      queryClient.invalidateQueries({ queryKey: KEY });
    },
    errorFallback: "Failed to remove comment",
  });
};