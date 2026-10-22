import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useGet, usePost, usePut, useDelete } from "../../hooks/useReactQueryHooks";
import type { Course, CourseDetail, Session, SessionDetail } from "../../types/models";

const ENDPOINT = "/courses";
const KEY = ["courses"];
const SESSIONS_KEY = ["sessions"];
const enc = encodeURIComponent;

/* ---------- GET: courses ---------- */

export const useCourses = () =>
  useGet<Course[]>(ENDPOINT, undefined, {
    queryKey: KEY,
    errorFallback: "Failed to load courses",
  });

export const usePopularCourses = () =>
  useGet<Course[]>(`${ENDPOINT}/popular`, undefined, {
    queryKey: [...KEY, "popular"],
    silentError: true,
  });

export const usePresellCourses = () =>
  useGet<Course[]>(`${ENDPOINT}/presell`, undefined, {
    queryKey: [...KEY, "presell"],
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

/* ---------- GET: sessions ---------- */

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

/* ---------- POST ---------- */

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

/* ---------- PUT ---------- */

/* FormData so a new cover can be sent; without a cover the current one stays */
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

/* courseId is a hook argument because the body here is FormData (the video) */
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

/* ---------- DELETE ---------- */

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