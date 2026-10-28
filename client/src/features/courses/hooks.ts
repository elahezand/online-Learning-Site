import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useGet, usePost, usePut, useDelete } from "../../hooks/useReactQueryHooks";
import type { Course, CourseDetail, Paginated, Session, SessionDetail } from "../../types/models";

const ENDPOINT = "/courses";
const KEY = ["courses"];
const SESSIONS_KEY = ["sessions"];
const enc = encodeURIComponent;

export interface CourseQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: "start" | "presell";
  free?: 0 | 1;
  sort?: "newest" | "oldest" | "price-asc" | "price-desc" | "name";
}

export const useCourses = (query: CourseQuery = {}) =>
  useGet<Paginated<Course>>(ENDPOINT, { ...query }, {
    queryKey: [...KEY, "list", query],
    placeholderData: keepPreviousData,
    errorFallback: "Failed to load courses",
  });

export const usePopularCourses = (query:CourseQuery = {}) =>
  useGet<Course[]>(`${ENDPOINT}/popular`, { ...query }, {
    queryKey: [...KEY, "popular", query],
    silentError: true,
  });

export const useCategoryCourses = (categoryName?: string) =>
  useGet<Course[]>(`${ENDPOINT}/category/${enc(categoryName ?? "")}`, undefined, {
    queryKey: [...KEY, "category", categoryName],
    enabled: Boolean(categoryName),
    errorFallback: "Failed to load courses",
  });

export const useCourse = (shortName?: string) =>
  useGet<CourseDetail>(`${ENDPOINT}/${enc(shortName ?? "")}`, undefined, {
    queryKey: [...KEY, "detail", shortName],
    enabled: Boolean(shortName),
    errorFallback: "Failed to load course",
  });

export const useRelatedCourses = (shortName?: string) =>
  useGet<Course[]>(`${ENDPOINT}/related/${enc(shortName ?? "")}`, undefined, {
    queryKey: [...KEY, "related", shortName],
    enabled: Boolean(shortName),
    silentError: true,
  });

export const useSessions = () =>
  useGet<Session[]>(`${ENDPOINT}/sessions`, undefined, {
    queryKey: SESSIONS_KEY,
    errorFallback: "Failed to load sessions",
  });

export const useSession = (shortName?: string, sessionId?: string) =>
  useGet<SessionDetail>(`${ENDPOINT}/${enc(shortName ?? "")}/${enc(sessionId ?? "")}`, undefined, {
    queryKey: [...SESSIONS_KEY, shortName, sessionId],
    enabled: Boolean(shortName && sessionId),
    errorFallback: "Failed to load session",
  });

export const useCreateCourse = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return usePost<unknown, FormData>(ENDPOINT, {
    onSuccess: () => {
      toast.success("Course created");
      queryClient.invalidateQueries({ queryKey: KEY });
      onSuccessCallback?.();
    },
    errorFallback: "Failed to create course",
  });
};

export const useUpdateCourse = (courseId: string, onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return usePut<unknown, FormData>(`${ENDPOINT}/${courseId}`, {
    onSuccess: () => {
      toast.success("Course updated");
      queryClient.invalidateQueries({ queryKey: KEY });
      onSuccessCallback?.();
    },
    errorFallback: "Failed to update course",
  });
};

export const useRegisterCourse = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return usePost<unknown, { courseId: string; price: number }>(({ courseId }) => `${ENDPOINT}/${courseId}/register`, {
    onSuccess: () => {
      toast.success("You are registered successfully");
      queryClient.invalidateQueries({ queryKey: KEY });
      queryClient.invalidateQueries({ queryKey: ["me", "courses"] });
      onSuccessCallback?.();
    },
    errorFallback: "Registration failed",
  });
};

export const useCreateSession = (courseId: string, onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return usePost<unknown, FormData>(`${ENDPOINT}/${courseId}/sessions`, {
    onSuccess: () => {
      toast.success("Session created");
      queryClient.invalidateQueries({ queryKey: SESSIONS_KEY });
      queryClient.invalidateQueries({ queryKey: KEY });
      onSuccessCallback?.();
    },
    errorFallback: "Failed to create session",
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useDelete<unknown, string>((id: string) => `${ENDPOINT}/${id}`, {
    onSuccess: () => {
      toast.success("Course removed");
      queryClient.invalidateQueries({ queryKey: KEY });
    },
    errorFallback: "Failed to remove course",
  });
};

export const useDeleteSession = () => {
  const queryClient = useQueryClient();

  return useDelete<unknown, string>((id: string) => `${ENDPOINT}/sessions/${id}`, {
    onSuccess: () => {
      toast.success("Session removed");
      queryClient.invalidateQueries({ queryKey: SESSIONS_KEY });
      queryClient.invalidateQueries({ queryKey: KEY });
    },
    errorFallback: "Failed to remove session",
  });
};