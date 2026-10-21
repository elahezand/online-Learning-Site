import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useGet, usePost, usePut, useDelete } from "../../hooks/useReactQueryHooks";

const ENDPOINT = "/category";
const KEY = ["categories"];

/* ---------- GET ---------- */

export const useCategories = () =>
  useGet(ENDPOINT, undefined, {
    queryKey: KEY,
    errorFallback: "Failed to load categories",
  });

/* ---------- POST ---------- */

export const useCreateCategory = (onSuccessCallback) => {
  const queryClient = useQueryClient();

  return usePost(ENDPOINT, {
    onSuccess: () => {
      toast.success("Category created");
      queryClient.invalidateQueries({ queryKey: KEY });
      onSuccessCallback?.();
    },
    errorFallback: "Failed to create category",
  });
};

/* ---------- PUT ---------- */

export const useUpdateCategory = (onSuccessCallback) => {
  const queryClient = useQueryClient();

  return usePut(({ id }) => `${ENDPOINT}/${id}`, {
    onSuccess: () => {
      toast.success("Category updated");
      queryClient.invalidateQueries({ queryKey: KEY });
      onSuccessCallback?.();
    },
    errorFallback: "Failed to update category",
  });
};

/* ---------- DELETE ---------- */

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useDelete((id) => `${ENDPOINT}/${id}`, {
    onSuccess: () => {
      toast.success("Category removed");
      queryClient.invalidateQueries({ queryKey: KEY });
    },
    errorFallback: "Failed to remove category",
  });
};