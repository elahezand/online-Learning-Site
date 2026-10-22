import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Department, Ticket, TicketAnswer, TicketMessage, TicketThread } from "../../types/models";
import type { TicketData } from "../../validators";
import { api } from "../../api/client";
import { useGet, usePost } from "../../hooks/useReactQueryHooks";
import type { ApiError } from "../../types/api";

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

  return usePost<unknown, TicketData & { course?: string }>(ENDPOINT, {
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

/* ---------- Conversation ---------- */

export const threadKey = (id?: string) => [...KEY, "thread", id];

/*
 * The full conversation comes from GET /tickets/:id/messages. Until the
 * backend has that endpoint (404), fall back to GET /tickets/answer/:id,
 * which only knows the first message and the first answer.
 */
const fetchThread = async (id: string, signal: AbortSignal): Promise<TicketThread> => {
  try {
    const { data } = await api.get<TicketThread>(`${ENDPOINT}/${id}/messages`, { signal });
    return data;
  } catch (error) {
    if ((error as ApiError).response?.status !== 404) throw error;
    const { data } = await api.get<TicketAnswer>(`${ENDPOINT}/answer/${id}`, { signal });
    const messages: TicketMessage[] = [];
    if (data.ticket) messages.push({ _id: `${id}-question`, body: data.ticket, isAnswer: 0 });
    if (data.answer) messages.push({ _id: `${id}-answer`, body: data.answer, isAnswer: 1 });
    return { messages };
  }
};

export const useTicketThread = (id?: string) =>
  useQuery<TicketThread, ApiError>({
    queryKey: threadKey(id),
    queryFn: ({ signal }) => fetchThread(id ?? "", signal),
    enabled: Boolean(id),
    // New replies show up without reloading, like a chat
    refetchInterval: 20 * 1000,
    staleTime: 10 * 1000,
  });

/*
 * Send a message in a ticket. POST /tickets/:id/messages works for both sides;
 * until the backend has it, the admin falls back to POST /tickets/answer.
 * The message appears in the chat right away and is rolled back on error.
 */
export const useSendTicketMessage = (ticketId: string, asAdmin: boolean) => {
  const queryClient = useQueryClient();
  const key = threadKey(ticketId);

  return useMutation<unknown, ApiError, string, { previous?: TicketThread }>({
    mutationFn: async (body) => {
      try {
        await api.post(`${ENDPOINT}/${ticketId}/messages`, { body });
      } catch (error) {
        if (!asAdmin || (error as ApiError).response?.status !== 404) throw error;
        await api.post(`${ENDPOINT}/answer`, { ticketID: ticketId, body });
      }
    },
    onMutate: async (body) => {
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
    onError: (_error, _body, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: key });
      queryClient.invalidateQueries({ queryKey: asAdmin ? KEY : MY_KEY, exact: true });
    },
  });
};
