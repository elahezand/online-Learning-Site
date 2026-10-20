import api from "./client"

export const commentsApi = {
    getAll: (options) => api.get("/comments", options),
    create: ({ body, score, courseShortName }) => api.post("/comments", { body, score, courseShortName }),
    remove: (id) => api.delete(`/comments/${id}`),
    accept: (id) => api.put(`/comments/accept/${id}`),
    reject: (id) => api.put(`/comments/reject/${id}`),
    answer: (id, body) => api.post(`/comments/answer/${id}`, { body }),
}
