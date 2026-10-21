import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useGet, usePost } from "../../hooks/useReactQueryHooks";

const ENDPOINT = "/tickets";
const KEY = ["tickets"];
const MY_KEY = ["me", "tickets"];

/* ---------- GET ---------- */

/* Admin: all tickets */
export const useTickets = () =>
  useGet(ENDPOINT, undefined, {
    queryKey: KEY,
    errorFallback: "Failed to load tickets",
  });

/* User panel: my tickets */
export const useMyTickets = () =>
  useGet(`${ENDPOINT}/user`, undefined, {
    queryKey: MY_KEY,
    errorFallback: "Failed to load your tickets",
  });

export const useTicketAnswer = (id) =>
  useGet(`${ENDPOINT}/answer/${id}`, undefined, {
    queryKey: [...KEY, "answer", id],
    enabled: Boolean(id),
    errorFallback: "Failed to load ticket",
  });

/* Departments almost never change */
export const useDepartments = () =>
  useGet(`${ENDPOINT}/departments`, undefined, {
    queryKey: [...KEY, "departments"],
    staleTime: Infinity,
    errorFallback: "Failed to load departments",
  });

export const useDepartmentSubs = (departmentId) =>
  useGet(`${ENDPOINT}/departments-subs/${departmentId}`, undefined, {
    queryKey: [...KEY, "departments", departmentId],
    enabled: Boolean(departmentId) && departmentId !== "-1",
    staleTime: Infinity,
    errorFallback: "Failed to load sub-departments",
  });

/* ---------- POST ---------- */

export const useCreateTicket = (onSuccessCallback) => {
  const queryClient = useQueryClient();

  return usePost(ENDPOINT, {
    onSuccess: () => {
      toast.success("Your ticket was sent");
      queryClient.invalidateQueries({ queryKey: MY_KEY });
      onSuccessCallback?.();
    },
    errorFallback: "Failed to send ticket",
  });
};

export const useAnswerTicket = (onSuccessCallback) => {
  const queryClient = useQueryClient();

  return usePost(`${ENDPOINT}/answer`, {
    onSuccess: () => {
      toast.success("Your answer was sent");
      queryClient.invalidateQueries({ queryKey: KEY });
      onSuccessCallback?.();
    },
    errorFallback: "Failed to send answer",
  });
};