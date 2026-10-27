import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useGet, usePost } from "../../hooks/useReactQueryHooks";
import { useAuth } from "./useAuth";
import tokenStorage from "../../api/tokenStorage";
import type { AuthTokens, User } from "../../types/models";
import type { LoginPayload, RegisterPayload } from "./types";

const noRefresh = { skipRefresh: true };

const useStartSession = () => {
  const { refreshUser } = useAuth();
  const queryClient = useQueryClient();

  return async ({ accessToken, refreshToken }: AuthTokens) => {
    queryClient.resetQueries();

    tokenStorage.set(accessToken ?? "", refreshToken);
    await refreshUser();
  };
};

export const useLogin = (onSuccessCallback?: () => void) => {
  const startSession = useStartSession();

  return usePost<AuthTokens, LoginPayload>("/auth/login", {
    axiosConfig: noRefresh,
    onSuccess: async (res) => {
      await startSession(res);
      toast.success("Welcome to ACADEMIA");
      onSuccessCallback?.();
    },
    errorFallback: "Username or password is wrong",
  });
};

export const useRegister = (onSuccessCallback?: () => void) => {
  const startSession = useStartSession();

  return usePost<AuthTokens, RegisterPayload>("/auth/register", {
    axiosConfig: noRefresh,
    onSuccess: async (res) => {
      if (!res?.accessToken) {
        toast.warning("Your phone number has been banned");
        return;
      }
      await startSession(res);
      toast.success("Welcome to ACADEMIA!");
      onSuccessCallback?.();
    },
    errorFallback: "Username or email already exists",
  });
};

export const useMe = (enabled = true) =>
  useGet<User>("/auth/me", undefined, {
    queryKey: ["me"],
    enabled,
    retry: false,
    silentError: true,
    axiosConfig: { silentAuth: true },
  });