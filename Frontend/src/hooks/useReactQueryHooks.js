import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "../api/client";

const resolveUrl = (url, data) => (typeof url === "function" ? url(data) : url);

const showErrorToast = (error, fallback) => {
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

export const useGet = (url, params, options) => {
  const { axiosConfig, silentError, errorFallback, ...queryOptions } = options || {};

  return useQuery({
    queryKey: options?.queryKey ?? [url, params],

    queryFn: async ({ signal }) => {
      try {
        const { data } = await api.get(url, {
          ...axiosConfig,
          params,
          signal,
          paramsSerializer: { indexes: null },
        });

        return data;
      } catch (error) {
        if (!silentError) {
          showErrorToast(error, errorFallback || "Failed to load data");
        }
        throw error;
      }
    },

    staleTime: 5 * 60 * 1000,
    ...queryOptions,
  });
};

const createMutationHook = (method) => (url, options) => {
  const { errorFallback, onError, axiosConfig, ...restOptions } = options || {};

  return useMutation({
    mutationFn: async (data) => {
      const targetUrl = resolveUrl(url, data);

      const { data: res } =
        method === "delete"
          ? await api.delete(targetUrl, axiosConfig)
          : await api[method](targetUrl, data, axiosConfig);

      return res;
    },

    onError: (error, variables, context) => {
      showErrorToast(error, errorFallback || "Something went wrong");
      onError?.(error, variables, context);
    },

    ...restOptions,
  });
};

export const usePost = createMutationHook("post");
export const usePatch = createMutationHook("patch");
export const usePut = createMutationHook("put");
export const useDelete = createMutationHook("delete");