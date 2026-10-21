import type { AdminDashboardInfo, IndexInfo } from "../../types/models";
import { useGet } from "../../hooks/useReactQueryHooks";

const KEY = ["infos"];

export const useIndexInfo = () =>
  useGet<IndexInfo>("/infos/index", undefined, {
    queryKey: [...KEY, "index"],
    silentError: true,
  });

export const useAdminDashboard = () =>
  useGet<AdminDashboardInfo>("/infos/p-admin", undefined, {
    queryKey: [...KEY, "p-admin"],
    errorFallback: "Failed to load dashboard",
  });
