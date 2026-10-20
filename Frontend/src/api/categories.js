import api from "./client"

export const categoriesApi = {
    getAll: (options) => api.get("/category", options),
    create: ({ name, title }) => api.post("/category", { name, title }),
    update: (id, { name, title }) => api.put(`/category/${id}`, { name, title }),
    remove: (id) => api.delete(`/category/${id}`),
}
