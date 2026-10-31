import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useGet, usePost } from "../../hooks/useReactQueryHooks";
import { useAuth } from "../auth/useAuth";
import type { AdminOrder, Order, OrderStatus, Paginated, PaymentStatus } from "../../types/models";

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
  const { refreshUser } = useAuth();

  return usePost<Order, { id: string }>(({ id }) => `/orders/me/${id}/cancel`, {
    onSuccess: () => {
      toast.success("Order cancelled");
      queryClient.invalidateQueries({ queryKey: KEY });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      refreshUser();
    },
    errorFallback: "Failed to cancel order",
  });
};

const ADMIN_KEY = ["orders"];

export interface OrderQuery {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  q?: string;
}

export interface SweepResult {
  finished: number;
  paid: number;
  cancelled: number;
}

export const useAdminOrders = (query: OrderQuery = {}) =>
  useGet<Paginated<AdminOrder>>("/orders", { ...query }, {
    queryKey: [...ADMIN_KEY, "list", query],
    placeholderData: keepPreviousData,
    errorFallback: "Failed to load orders",
  });

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return usePost<AdminOrder, { id: string }>(({ id }) => `/orders/${id}/cancel`, {
    onSuccess: () => {
      toast.success("Order cancelled and refunded");
      queryClient.invalidateQueries({ queryKey: ADMIN_KEY });
    },
    errorFallback: "Failed to cancel order",
  });
};

export const useRunOrderSweeps = () => {
  const queryClient = useQueryClient();

  return usePost<SweepResult, void>("/orders/sweeps", {
    onSuccess: (result) => {
      toast.success(`Checks finished: ${result.finished + result.paid} completed, ${result.cancelled} closed`);
      queryClient.invalidateQueries({ queryKey: ADMIN_KEY });
    },
    errorFallback: "Failed to run order checks",
  });
};
