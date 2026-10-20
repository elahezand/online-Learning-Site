import api from "./client"

export const discountsApi = {
    getAll: (options) => api.get("/offs", options),
    create: ({ code, percent, max, course }) => api.post("/offs", { code, percent, max, course }),
    remove: (id) => api.delete(`/offs/${id}`),
    apply: (code, courseId) => api.post(`/offs/${encodeURIComponent(code)}`, { course: courseId }),
    setSiteWide: (discount) => api.post("/offs/all", { discount }),
}
