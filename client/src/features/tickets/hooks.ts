import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Department, Ticket, TicketAnswer } from "../../types/models";
import type { TicketData } from "../../validators";
import { useGet, usePost } from "../../hooks/useReactQueryHooks";

const ENDPOINT = "/tickets";
const KEY = ["tickets"];
const MY_KEY = ["me", "tickets"];

/* ---------- GET ---------- */

/* Admin: all tickets */
export const useTickets = () =>
  useGet<Ticket[]>(ENDPOINT, undefined, {
    queryKey: KEY,
    errorFallback: "Failed to load tickets",
  });

/* User panel: my tickets */
export const useMyTickets = () =>
  useGet<Ticket[]>(`${ENDPOINT}/user`, undefined, {
    queryKey: MY_KEY,
    errorFallback: "Failed to load your tickets",
  });

export const useTicketAnswer = (id?: string) =>
  useGet<TicketAnswer>(`${ENDPOINT}/answer/${id}`, undefined, {
    queryKey: [...KEY, "answer", id],
    enabled: Boolean(id),
    errorFallback: "Failed to load ticket",
  });

/* Departments almost never change */
export const useDepartments = () =>
  useGet<Department[]>(`${ENDPOINT}/departments`, undefined, {
    queryKey: [...KEY, "departments"],
    staleTime: Infinity,
    errorFallback: "Failed to load departments",
  });

export const useDepartmentSubs = (departmentId?: string) =>
  useGet<Department[]>(`${ENDPOINT}/departments-subs/${departmentId}`, undefined, {
    queryKey: [...KEY, "departments", departmentId],
    enabled: Boolean(departmentId) && departmentId !== "-1",
    staleTime: Infinity,
    errorFallback: "Failed to load sub-departments",
  });

/* ---------- POST ---------- */

export const useCreateTicket = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return usePost<unknown, TicketData>(ENDPOINT, {
    onSuccess: () => {
      toast.success("Your ticket was sent");
      queryClient.invalidateQueries({ queryKey: MY_KEY });
      onSuccessCallback?.();
    },
    errorFallback: "Failed to send ticket",
  });
};

export const useAnswerTicket = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return usePost<unknown, { ticketID: string; body: string }>(`${ENDPOINT}/answer`, {
    onSuccess: () => {
      toast.success("Your answer was sent");
      queryClient.invalidateQueries({ queryKey: KEY });
      onSuccessCallback?.();
    },
    errorFallback: "Failed to send answer",
  });
};