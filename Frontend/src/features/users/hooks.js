import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useGet, usePost, usePut, useDelete } from "../../hooks/useReactQueryHooks";
import { useAuth } from "../auth/AuthContext";

const ENDPOINT = "/users";
const KEY = ["users"];

/* ---------- GET ---------- */

/* Admin: all users */
export const useUsers = () =>
  useGet(ENDPOINT, undefined, {
    queryKey: KEY,
    errorFallback: "Failed to load users",
  });

/* User panel: courses I bought */
export const useMyCourses = () =>
  useGet(`${ENDPOINT}/courses`, undefined, {
    queryKey: ["me", "courses"],
    errorFallback: "Failed to load your courses",
  });

/* ---------- PUT ---------- */

export const useBanUser = () => {
  const queryClient = useQueryClient();

  return usePut(({ id }) => `${ENDPOINT}/ban/${id}`, {
    onSuccess: () => {
      toast.success("User banned");
      queryClient.invalidateQueries({ queryKey: KEY });
    },
    errorFallback: "Failed to ban user",
  });
};

export const useChangeRole = () => {
  const queryClient = useQueryClient();

  return usePut(`${ENDPOINT}/role`, {
    onSuccess: () => {
      toast.success("Role changed");
      queryClient.invalidateQueries({ queryKey: KEY });
    },
    errorFallback: "Failed to change role",
  });
};

/* Account details: after saving, reload the logged-in user */
export const useUpdateMe = (onSuccessCallback) => {
  const { refreshUser } = useAuth();

  return usePut(ENDPOINT, {
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

  return useDelete((id) => `${ENDPOINT}/${id}`, {
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
export const useCreateUser = (onSuccessCallback) => {
  const queryClient = useQueryClient();

  return usePost("/auth/register", {
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
