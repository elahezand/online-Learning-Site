import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Department, Ticket, TicketMessage, TicketThread } from "../../types/models";
import type { TicketData } from "../../validators";
import { api } from "../../api/client";
import { useGet, usePost } from "../../hooks/useReactQueryHooks";
import type { ApiError } from "../../types/api";

const ENDPOINT = "/tickets";
const KEY = ["tickets"];
const MY_KEY = ["me", "tickets"];

export const useTickets = () =>
  useGet<Ticket[]>(ENDPOINT, undefined, {
    queryKey: KEY,
    errorFallback: "Failed to load tickets",
  });

export const useMyTickets = () =>
  useGet<Ticket[]>(`${ENDPOINT}/user`, undefined, {
    queryKey: MY_KEY,
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

const fetchThread = async (id: string, signal: AbortSignal): Promise<TicketThread> => {
  const { data } = await api.get<TicketThread>(`${ENDPOINT}/${id}/messages`, { signal });
  return data;
};

export const useTicketThread = (id?: string) =>
  useQuery<TicketThread, ApiError>({
    queryKey: threadKey(id),
    queryFn: ({ signal }) => fetchThread(id ?? "", signal),
    enabled: Boolean(id),
    refetchInterval: 20 * 1000,
    staleTime: 10 * 1000,
  });

export const useSendTicketMessage = (ticketId: string, asAdmin: boolean) => {
  const queryClient = useQueryClient();
  const key = threadKey(ticketId);

  return useMutation<unknown, ApiError, string, { previous?: TicketThread }>({
    mutationFn: (body) => api.post(`${ENDPOINT}/${ticketId}/messages`, { body }),
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
