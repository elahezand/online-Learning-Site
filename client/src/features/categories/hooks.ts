import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Category } from "../../types/models";
import { useGet, usePost, usePut, useDelete } from "../../hooks/useReactQueryHooks";

const ENDPOINT = "/category";
const KEY = ["categories"];

export const useCategories = () =>
  useGet<Category[]>(ENDPOINT, undefined, {
    queryKey: KEY,
    errorFallback: "Failed to load categories",
  });

export const useCreateCategory = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return usePost<unknown, { title: string; name: string }>(ENDPOINT, {
    onSuccess: () => {
      toast.success("Category created");
      queryClient.invalidateQueries({ queryKey: KEY });
      onSuccessCallback?.();
    },
    errorFallback: "Failed to create category",
  });
};

export const useUpdateCategory = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return usePut<unknown, { id: string; title: string; name: string }>(({ id }) => `${ENDPOINT}/${id}`, {
    onSuccess: () => {
      toast.success("Category updated");
      queryClient.invalidateQueries({ queryKey: KEY });
      onSuccessCallback?.();
    },
    errorFallback: "Failed to update category",
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useDelete<unknown, string>((id: string) => `${ENDPOINT}/${id}`, {
    onSuccess: () => {
      toast.success("Category removed");
      queryClient.invalidateQueries({ queryKey: KEY });
    },
    errorFallback: "Failed to remove category",
  });
};
