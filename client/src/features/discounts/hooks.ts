import { useQueryClient,keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Campaign, Discount, Paginated } from "../../types/models";
import { useGet, usePost, useDelete } from "../../hooks/useReactQueryHooks";

const ENDPOINT = "/offs";
const KEY = ["discounts"];


export const useDiscounts = (query: { page?: number; limit?: number } = {}) =>
  useGet<Paginated<Discount>>(ENDPOINT, { ...query }, {
    queryKey: [...KEY, query],
    placeholderData: keepPreviousData,
    errorFallback: "Failed to load discounts",
  });


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

const CAMPAIGN_KEY = ["campaign"];

export const useActiveCampaign = () =>
  useGet<Campaign | null>(`${ENDPOINT}/campaign`, undefined, {
    queryKey: CAMPAIGN_KEY,
    silentError: true,
  });

export const useSiteWideDiscount = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return usePost<Campaign, { percent: number; endsAt: string }>(`${ENDPOINT}/all`, {
    onSuccess: () => {
      toast.success("Site-wide discount is running");
      queryClient.invalidateQueries({ queryKey: CAMPAIGN_KEY });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      onSuccessCallback?.();
    },
    errorFallback: "Failed to create site-wide discount",
  });
};

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


export const useEndSiteWideDiscount = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useDelete<unknown, void>(`${ENDPOINT}/all`, {
    onSuccess: () => {
      toast.success("Site-wide discount ended");
      queryClient.invalidateQueries({ queryKey: CAMPAIGN_KEY });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      onSuccessCallback?.();
    },
    errorFallback: "Failed to end site-wide discount",
  });
};