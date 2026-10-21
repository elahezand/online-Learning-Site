import type { Order } from "../../types/models";
import { useGet } from "../../hooks/useReactQueryHooks";

export const useMyOrders = () =>
  useGet<Order[]>("/orders", undefined, {
    queryKey: ["me", "orders"],
    errorFallback: "Failed to load orders",
  });