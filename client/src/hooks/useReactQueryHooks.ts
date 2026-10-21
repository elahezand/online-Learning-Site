import { useQuery, useMutation } from "@tanstack/react-query";
import type { QueryKey, UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";
import type { AxiosRequestConfig } from "axios";
import { toast } from "sonner";
import { api } from "../api/client";
import type { ApiError } from "../types/api";

type UrlBuilder<TVariables> = string | ((variables: TVariables) => string);

const resolveUrl = <TVariables>(url: UrlBuilder<TVariables>, data: TVariables) =>
  typeof url === "function" ? url(data) : url;

const showErrorToast = (error: ApiError, fallback: string) => {
  if (error?._authToastShown) return;

  const responseData = error?.response?.data;
  let message = fallback;

  if (Array.isArray(responseData?.errors) && responseData.errors.length > 0) {
    message = responseData.errors
      .map((item) => `${item?.message}, ${item?.field}`)
      .filter(Boolean)
      .join(" | ");
  } else if (responseData?.message) {
    message = responseData.message;
  }

  toast.error(message, { id: message });
};

export interface GetOptions<TData> extends Omit<UseQueryOptions<TData, ApiError>, "queryKey" | "queryFn"> {
  queryKey?: QueryKey;
  axiosConfig?: AxiosRequestConfig;
  silentError?: boolean;
  errorFallback?: string;
}

export const useGet = <TData = unknown>(url: string, params?: Record<string, unknown>, options?: GetOptions<TData>) => {
  const { axiosConfig, silentError, errorFallback, queryKey, ...queryOptions } = options || {};

  return useQuery<TData, ApiError>({
    queryKey: queryKey ?? [url, params],

    queryFn: async ({ signal }) => {
      try {
        const { data } = await api.get<TData>(url, {
          ...axiosConfig,
          params,
          signal,
          paramsSerializer: { indexes: null },
        });

        return data;
      } catch (error) {
        // A cancelled request (component unmounted, StrictMode in dev) is not an error
        if (!silentError && !axios.isCancel(error)) {
          showErrorToast(error as ApiError, errorFallback || "Failed to load data");
        }
        throw error;
      }
    },

    staleTime: 5 * 60 * 1000,
    ...queryOptions,
  });
};

export interface MutationOptions<TData, TVariables> extends Omit<UseMutationOptions<TData, ApiError, TVariables>, "mutationFn"> {
  axiosConfig?: AxiosRequestConfig;
  errorFallback?: string;
}

type Method = "post" | "patch" | "put" | "delete";

const createMutationHook = (method: Method) =>
  <TData = unknown, TVariables = void>(url: UrlBuilder<TVariables>, options?: MutationOptions<TData, TVariables>) => {
    const { errorFallback, onError, axiosConfig, ...restOptions } = options || {};

    return useMutation<TData, ApiError, TVariables>({
      mutationFn: async (data) => {
        const targetUrl = resolveUrl(url, data);

        const { data: res } =
          method === "delete"
            ? await api.delete<TData>(targetUrl, axiosConfig)
            : await api[method]<TData>(targetUrl, data, axiosConfig);

        return res;
      },

      onError: (error, variables, onMutateResult, context) => {
        showErrorToast(error, errorFallback || "Something went wrong");
        onError?.(error, variables, onMutateResult, context);
      },

      ...restOptions,
    });
  };

export const usePost = createMutationHook("post");
export const usePatch = createMutationHook("patch");
export const usePut = createMutationHook("put");
export const useDelete = createMutationHook("delete");