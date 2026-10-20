import api from "./client"

export const articlesApi = {
    getAll: (options) => api.get("/articles", options),
    getOne: (shortName, options) => api.get(`/articles/${encodeURIComponent(shortName)}`, options),
    publish: (formData) => api.post("/articles", formData),
    saveDraft: (formData) => api.post("/articles/draft", formData),
    remove: (id) => api.delete(`/articles/${id}`),
}
