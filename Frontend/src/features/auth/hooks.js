import { toast } from "sonner";
import { useGet, usePost } from "../../hooks/useReactQueryHooks";
import { useAuth } from "./AuthContext";

const noRefresh = { skipRefresh: true };

export const useLogin = (onSuccessCallback) => {
  const { login } = useAuth();

  return usePost("/auth/login", {
    axiosConfig: noRefresh,
    onSuccess: (res) => {
      login(res.accessToken, res.refreshToken);
      toast.success("Welcome to ACADEMIA");
      onSuccessCallback?.();
    },
    errorFallback: "Username or password is wrong",
  });
};

export const useRegister = (onSuccessCallback) => {
  const { login } = useAuth();

  return usePost("/auth/register", {
    axiosConfig: noRefresh,
    onSuccess: (res) => {
      if (!res?.accessToken) {
        toast.warning("Your phone number has been banned");
        return;
      }
      login(res.accessToken, res.refreshToken);
      toast.success("Welcome to ACADEMIA!");
      onSuccessCallback?.();
    },
    errorFallback: "Username or email already exists",
  });
};

export const useMe = (enabled = true) =>
  useGet("/auth/me", undefined, {
    queryKey: ["me"],
    enabled,
    retry: false,
    silentError: true,
    axiosConfig: { silentAuth: true },
  });