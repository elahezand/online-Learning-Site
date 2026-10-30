import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useGet, usePost } from "../../hooks/useReactQueryHooks";
import type { Order, OrderStatus, Paginated } from "../../types/models";

const KEY = ["me", "orders"];

export interface MyOrdersQuery {
  page?: number;
  limit?: number;
  status?: OrderStatus;
}

export const useMyOrders = (query: MyOrdersQuery = {}) =>
  useGet<Paginated<Order>>("/orders/me", { ...query }, {
    queryKey: [...KEY, query],
    placeholderData: keepPreviousData,
    errorFallback: "Failed to load orders",
  });

export const useCancelMyOrder = () => {
  const queryClient = useQueryClient();

  return usePost<Order, { id: string }>(({ id }) => `/orders/me/${id}/cancel`, {
    onSuccess: () => {
      toast.success("Order cancelled");
      queryClient.invalidateQueries({ queryKey: KEY });
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    errorFallback: "Failed to cancel order",
  });
};
