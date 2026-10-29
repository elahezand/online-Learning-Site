import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Department, Paginated, Ticket, TicketMessage, TicketThread } from "../../types/models";
import type { TicketData } from "../../validators";
import { useGet, usePost } from "../../hooks/useReactQueryHooks";

const ENDPOINT = "/tickets";
const KEY = ["tickets"];
const MY_KEY = ["me", "tickets"];

export interface MyTicketsQuery {
  page?: number;
  limit?: number;
  status?: "pending" | "answered";
}

export const useTickets = () =>
  useGet<Ticket[]>(ENDPOINT, undefined, {
    queryKey: KEY,
    errorFallback: "Failed to load tickets",
  });

export const useMyTickets = (query: MyTicketsQuery = {}) =>
  useGet<Paginated<Ticket>>(`${ENDPOINT}/user`, { ...query }, {
    queryKey: [...MY_KEY, query],
    placeholderData: keepPreviousData,
    errorFallback: "Failed to load your tickets",
  });

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

export const useCreateTicket = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return usePost<unknown, TicketData & { course?: string }>(ENDPOINT, {
    onSuccess: () => {
      toast.success("Your ticket was sent");
      queryClient.invalidateQueries({ queryKey: MY_KEY });
      onSuccessCallback?.();
    },
    errorFallback: "Failed to send ticket",
  });
};

export const threadKey = (id?: string) => [...KEY, "thread", id];

export const useTicketThread = (id?: string) =>
  useGet<TicketThread>(`${ENDPOINT}/${id}/messages`, undefined, {
    queryKey: threadKey(id),
    enabled: Boolean(id),
    refetchInterval: 20 * 1000,
    staleTime: 10 * 1000,
    silentError: true,
  });

export const useSendTicketMessage = (ticketId: string, asAdmin: boolean) => {
  const queryClient = useQueryClient();
  const key = threadKey(ticketId);

  return usePost<unknown, { body: string }>(`${ENDPOINT}/${ticketId}/messages`, {
    onMutate: async ({ body }) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<TicketThread>(key);
      const pending: TicketMessage = {
        _id: `pending-${Date.now()}`,
        body,
        isAnswer: asAdmin ? 1 : 0,
        createdAt: new Date().toISOString(),
      };
      queryClient.setQueryData<TicketThread>(key, (old) => ({ ...old, messages: [...(old?.messages ?? []), pending] }));
      return { previous };
    },
    onError: (_error, _variables, result) => {
      const previous = (result as { previous?: TicketThread } | undefined)?.previous;
      if (previous) queryClient.setQueryData(key, previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: key });
      queryClient.invalidateQueries({ queryKey: asAdmin ? KEY : MY_KEY, exact: asAdmin });
    },
    errorFallback: "Failed to send message",
  });
};