import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AuthTokens, Course, MyCourse, Role, User } from "../../types/models";
import type { RegisterPayload } from "../auth/types";
import { useGet, usePost, usePut, useDelete } from "../../hooks/useReactQueryHooks";
import { useAuth } from "../auth/useAuth";

const ENDPOINT = "/users";
const KEY = ["users"];

/* ---------- GET ---------- */

/* Admin: all users */
export const useUsers = () =>
  useGet<User[]>(ENDPOINT, undefined, {
    queryKey: KEY,
    errorFallback: "Failed to load users",
  });

/* User panel: courses I bought */
export const useMyCourses = () =>
  useGet<MyCourse[]>(`${ENDPOINT}/courses`, undefined, {
    queryKey: ["me", "courses"],
    errorFallback: "Failed to load your courses",
  });

/* ---------- PUT ---------- */

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

/* Account details: after saving, reload the logged-in user */
export const useUpdateMe = (onSuccessCallback?: () => void) => {
  const { refreshUser } = useAuth();

  return usePut<unknown, Partial<Pick<User, "name" | "username" | "email" | "phone">> & { password?: string }>(ENDPOINT, {
    onSuccess: () => {
      toast.success("Your account was updated");
      refreshUser();
      onSuccessCallback?.();
    },
    errorFallback: "Failed to update account",
  });
};

/* ---------- DELETE ---------- */

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

/* ---------- POST ---------- */

/* Admin adds a user. Uses /auth/register, but unlike useRegister it does NOT
   store the new user's tokens — the admin stays logged in as themselves. */
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

/* /users/courses returns enrollments ({ course, price }); older backends return
   the courses themselves. Either way, give back the course. */
export const enrolledCourse = (item: MyCourse | Course): Pick<Course, "_id" | "name"> | undefined =>
  "course" in item && item.course ? item.course : "name" in item ? item : undefined;
