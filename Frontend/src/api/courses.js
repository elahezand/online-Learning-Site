import api from "./client"

const enc = encodeURIComponent

export const coursesApi = {
    getAll: (options) => api.get("/courses", options),
    getPopular: (options) => api.get("/courses/popular", options),
    getPresell: (options) => api.get("/courses/presell", options),
    getByCategory: (categoryName, options) => api.get(`/courses/category/${enc(categoryName)}`, options),
    getOne: (shortName, options) => api.get(`/courses/${enc(shortName)}`, options),
    getRelated: (shortName, options) => api.get(`/courses/related/${enc(shortName)}`, options),
    create: (formData) => api.post("/courses", formData),
    remove: (id) => api.delete(`/courses/${id}`),
    register: (courseId, price) => api.post(`/courses/${courseId}/register`, { price }),

    // Sessions
    getAllSessions: (options) => api.get("/courses/sessions", options),
    getSession: (shortName, sessionId, options) => api.get(`/courses/${enc(shortName)}/${enc(sessionId)}`, options),
    createSession: (courseId, formData) => api.post(`/courses/${courseId}/sessions`, formData),
    removeSession: (sessionId) => api.delete(`/courses/sessions/${sessionId}`),
}
