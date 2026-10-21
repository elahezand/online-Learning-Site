import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useGet, usePost, useDelete } from "../../hooks/useReactQueryHooks";

const ENDPOINT = "/offs";
const KEY = ["discounts"];

/* ---------- GET ---------- */

export const useDiscounts = () =>
  useGet(ENDPOINT, undefined, {
    queryKey: KEY,
    errorFallback: "Failed to load discounts",
  });

/* ---------- POST ---------- */

export const useCreateDiscount = (onSuccessCallback) => {
  const queryClient = useQueryClient();

  return usePost(ENDPOINT, {
    onSuccess: () => {
      toast.success("Discount created");
      queryClient.invalidateQueries({ queryKey: KEY });
      onSuccessCallback?.();
    },
    errorFallback: "Failed to create discount",
  });
};

/* Checks a code for a course and returns it (with `percent`). No success toast:
   the register flow continues with the discounted price. */
export const useApplyDiscount = () =>
  usePost(({ code }) => `${ENDPOINT}/${encodeURIComponent(code)}`, {
    errorFallback: "This code is not valid",
  });

export const useSiteWideDiscount = (onSuccessCallback) =>
  usePost(`${ENDPOINT}/all`, {
    onSuccess: () => {
      toast.success("Site-wide discount is running");
      onSuccessCallback?.();
    },
    errorFallback: "Failed to create site-wide discount",
  });

/* ---------- DELETE ---------- */

export const useDeleteDiscount = () => {
  const queryClient = useQueryClient();

  return useDelete((id) => `${ENDPOINT}/${id}`, {
    onSuccess: () => {
      toast.success("Discount removed");
      queryClient.invalidateQueries({ queryKey: KEY });
    },
    errorFallback: "Failed to remove discount",
  });
};