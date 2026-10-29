import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AuthTokens, Course, MyCourse, Paginated, Role, User } from "../../types/models";
import type { RegisterPayload } from "../auth/types";
import { useGet, usePost, usePut, useDelete } from "../../hooks/useReactQueryHooks";
import { useAuth } from "../auth/useAuth";

const ENDPOINT = "/users";
const KEY = ["users"];

export interface MyCoursesQuery {
  page?: number;
  limit?: number;
  status?: "free" | "paid" | "completed" | "in-progress";
}

export const useUsers = () =>
  useGet<User[]>(ENDPOINT, undefined, {
    queryKey: KEY,
    errorFallback: "Failed to load users",
  });

export const useMyCourses = (query: MyCoursesQuery = {}) =>
  useGet<Paginated<MyCourse>>(`${ENDPOINT}/courses`, { ...query }, {
    queryKey: ["me", "courses", query],
    placeholderData: keepPreviousData,
    errorFallback: "Failed to load your courses",
  });

export const useBanUser = () => {
  const queryClient = useQueryClient();

  return usePut<unknown, { id: string; phone?: string; email?: string }>(({ id }) => `${ENDPOINT}/ban/${id}`, {
    onSuccess: () => {
      toast.success("User banned");
      queryClient.invalidateQueries({ queryKey: KEY });
    },
    errorFallback: "Failed to ban user",
  });
};

export const useChangeRole = () => {
  const queryClient = useQueryClient();

  return usePut<unknown, { id: string; role: Role }>(`${ENDPOINT}/role`, {
    onSuccess: () => {
      toast.success("Role changed");
      queryClient.invalidateQueries({ queryKey: KEY });
    },
    errorFallback: "Failed to change role",
  });
};

export const useUpdateMe = (onSuccessCallback?: () => void) => {
  const { refreshUser } = useAuth();

return usePut<unknown, Partial<Pick<User, "name" | "username" | "email" | "phone">> & { password?: string; currentPassword?: string }>(ENDPOINT, {    onSuccess: () => {
      toast.success("Your account was updated");
      refreshUser();
      onSuccessCallback?.();
    },
    errorFallback: "Failed to update account",
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useDelete<unknown, string>((id: string) => `${ENDPOINT}/${id}`, {
    onSuccess: () => {
      toast.success("User removed");
      queryClient.invalidateQueries({ queryKey: KEY });
    },
    errorFallback: "Failed to remove user",
  });
};

export const useCreateUser = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return usePost<AuthTokens, RegisterPayload>("/auth/register", {
    axiosConfig: { skipRefresh: true },
    onSuccess: (res) => {
      if (!res?.accessToken) {
        toast.warning("This phone number has been banned");
        return;
      }
      toast.success("User added");
      queryClient.invalidateQueries({ queryKey: KEY });
      onSuccessCallback?.();
    },
    errorFallback: "Username or email already exists",
  });
};

export const enrolledCourse = (item: MyCourse | Course): Pick<Course, "_id" | "name"> | undefined =>
  "course" in item && item.course ? item.course : "name" in item ? item : undefined;