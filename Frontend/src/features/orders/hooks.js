import { useGet } from "../../hooks/useReactQueryHooks";

export const useMyOrders = () =>
  useGet("/orders", undefined, {
    queryKey: ["me", "orders"],
    errorFallback: "Failed to load orders",
  });