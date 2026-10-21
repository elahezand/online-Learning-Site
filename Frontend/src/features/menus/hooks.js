import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useGet, usePost, useDelete } from "../../hooks/useReactQueryHooks";

const ENDPOINT = "/menus";
const KEY = ["menus"];
const TEN_MINUTES = 10 * 60 * 1000;

/* ---------- GET ---------- */

/* Site navbar: rarely changes, and a failed menu shouldn't show an error */
export const useMainMenu = () =>
  useGet(ENDPOINT, undefined, {
    queryKey: [...KEY, "main"],
    staleTime: TEN_MINUTES,
    silentError: true,
  });

export const useTopbarMenu = () =>
  useGet(`${ENDPOINT}/topbar`, undefined, {
    queryKey: [...KEY, "topbar"],
    staleTime: TEN_MINUTES,
    silentError: true,
  });

/* Admin panel list */
export const useMenus = () =>
  useGet(`${ENDPOINT}/all`, undefined, {
    queryKey: [...KEY, "all"],
    errorFallback: "Failed to load menus",
  });

/* ---------- POST ---------- */

export const useCreateMenu = (onSuccessCallback) => {
  const queryClient = useQueryClient();

  return usePost(ENDPOINT, {
    onSuccess: () => {
      toast.success("Menu created");
      queryClient.invalidateQueries({ queryKey: KEY });
      onSuccessCallback?.();
    },
    errorFallback: "Failed to create menu",
  });
};

/* ---------- DELETE ---------- */

export const useDeleteMenu = () => {
  const queryClient = useQueryClient();

  return useDelete((id) => `${ENDPOINT}/${id}`, {
    onSuccess: () => {
      toast.success("Menu removed");
      queryClient.invalidateQueries({ queryKey: KEY });
    },
    errorFallback: "Failed to remove menu",
  });
};