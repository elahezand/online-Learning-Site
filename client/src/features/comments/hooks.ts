import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Comment, Paginated, Testimonial } from "../../types/models";
import { useGet, usePost, usePut, useDelete } from "../../hooks/useReactQueryHooks";

const ENDPOINT = "/comments";
const KEY = ["comments"];

export interface CommentQuery {
  page?: number;
  limit?: number;
  search?: string;
  course?: string;
  score?: number;
  status?: "pending" | "accepted";
  sort?: "newest" | "oldest" | "score";
}

export const useComments = (query: CommentQuery = {}) =>
  useGet<Paginated<Comment>>(ENDPOINT, { ...query }, {
    queryKey: [...KEY, "list", query],
    placeholderData: keepPreviousData,
    errorFallback: "Failed to load comments",
  });

export const useTopComments = (limit = 8) =>
  useGet<Testimonial[]>(`${ENDPOINT}/top`, { limit }, {
    queryKey: [...KEY, "top", limit],
    silentError: true,
  });

export const useCreateComment = (onSuccessCallback?: () => void) =>
  usePost<unknown, { body: string; score: string; courseShortName: string }>(ENDPOINT, {
    onSuccess: () => {
      toast.success("Your comment was sent and will be shown after approval");
      onSuccessCallback?.();
    },
    errorFallback: "Failed to send comment",
  });

export const useAnswerComment = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return usePost<unknown, { id: string; body: string }>(({ id }) => `${ENDPOINT}/answer/${id}`, {
    onSuccess: () => {
      toast.success("Your answer was sent");
      queryClient.invalidateQueries({ queryKey: KEY });
      onSuccessCallback?.();
    },
    errorFallback: "Failed to send answer",
  });
};

export const useAcceptComment = () => {
  const queryClient = useQueryClient();

  return usePut<unknown, { id: string }>(({ id }) => `${ENDPOINT}/accept/${id}`, {
    onSuccess: () => {
      toast.success("Comment accepted");
      queryClient.invalidateQueries({ queryKey: KEY });
    },
    errorFallback: "Failed to accept comment",
  });
};

export const useRejectComment = () => {
  const queryClient = useQueryClient();

  return usePut<unknown, { id: string }>(({ id }) => `${ENDPOINT}/reject/${id}`, {
    onSuccess: () => {
      toast.success("Comment rejected");
      queryClient.invalidateQueries({ queryKey: KEY });
    },
    errorFallback: "Failed to reject comment",
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useDelete<unknown, string>((id: string) => `${ENDPOINT}/${id}`, {
    onSuccess: () => {
      toast.success("Comment removed");
      queryClient.invalidateQueries({ queryKey: KEY });
    },
    errorFallback: "Failed to remove comment",
  });
};
