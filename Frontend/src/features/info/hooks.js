import { useGet } from "../../hooks/useReactQueryHooks";

const KEY = ["infos"];

export const useIndexInfo = () =>
  useGet("/infos/index", undefined, {
    queryKey: [...KEY, "index"],
    silentError: true,
  });

export const useAdminDashboard = () =>
  useGet("/infos/p-admin", undefined, {
    queryKey: [...KEY, "p-admin"],
    errorFallback: "Failed to load dashboard",
  });
