import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useGet, usePost, useDelete } from "../../hooks/useReactQueryHooks";

const ENDPOINT = "/articles";
const KEY = ["articles"];

/* ---------- GET ---------- */

export const useArticles = () =>
  useGet(ENDPOINT, undefined, {
    queryKey: KEY,
    errorFallback: "Failed to load articles",
  });

export const useArticle = (shortName) =>
  useGet(`${ENDPOINT}/${encodeURIComponent(shortName)}`, undefined, {
    queryKey: [...KEY, shortName],
    enabled: Boolean(shortName),
    errorFallback: "Failed to load article",
  });

/* ---------- POST ---------- */

export const usePublishArticle = (onSuccessCallback) => {
  const queryClient = useQueryClient();

  return usePost(ENDPOINT, {
    onSuccess: () => {
      toast.success("The article was published");
      queryClient.invalidateQueries({ queryKey: KEY });
      onSuccessCallback?.();
    },
    errorFallback: "Failed to publish article",
  });
};

export const useSaveDraft = (onSuccessCallback) => {
  const queryClient = useQueryClient();

  return usePost(`${ENDPOINT}/draft`, {
    onSuccess: () => {
      toast.success("The article was saved as draft");
      queryClient.invalidateQueries({ queryKey: KEY });
      onSuccessCallback?.();
    },
    errorFallback: "Failed to save draft",
  });
};

/* ---------- DELETE ---------- */

export const useDeleteArticle = () => {
  const queryClient = useQueryClient();

  return useDelete((id) => `${ENDPOINT}/${id}`, {
    onSuccess: () => {
      toast.success("The article was removed");
      queryClient.invalidateQueries({ queryKey: KEY });
    },
    errorFallback: "Failed to remove article",
  });
};