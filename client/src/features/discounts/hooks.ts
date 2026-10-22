import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Discount } from "../../types/models";
import { useGet, usePost, useDelete } from "../../hooks/useReactQueryHooks";

const ENDPOINT = "/offs";
const KEY = ["discounts"];

/* ---------- GET ---------- */

export const useDiscounts = () =>
  useGet<Discount[]>(ENDPOINT, undefined, {
    queryKey: KEY,
    errorFallback: "Failed to load discounts",
  });

/* ---------- POST ---------- */

export const useCreateDiscount = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return usePost<unknown, { code: string; percent: number; max: number; course: string }>(ENDPOINT, {
    onSuccess: () => {
      toast.success("Discount created");
      queryClient.invalidateQueries({ queryKey: KEY });
      onSuccessCallback?.();
    },
    errorFallback: "Failed to create discount",
  });
};


export const useApplyDiscount = () =>
  usePost<Pick<Discount, "percent">, { code: string; course: string }>(({ code }) => `${ENDPOINT}/${encodeURIComponent(code)}`, {
    errorFallback: "This code is not valid",
  });

export const useSiteWideDiscount = (onSuccessCallback?: () => void) =>
  usePost<unknown, { discount: number }>(`${ENDPOINT}/all`, {
    onSuccess: () => {
      toast.success("Site-wide discount is running");
      onSuccessCallback?.();
    },
    errorFallback: "Failed to create site-wide discount",
  });

/* ---------- DELETE ---------- */

export const useDeleteDiscount = () => {
  const queryClient = useQueryClient();

  return useDelete<unknown, string>((id: string) => `${ENDPOINT}/${id}`, {
    onSuccess: () => {
      toast.success("Discount removed");
      queryClient.invalidateQueries({ queryKey: KEY });
    },
    errorFallback: "Failed to remove discount",
  });
};