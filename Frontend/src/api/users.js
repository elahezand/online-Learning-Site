import api from "./client"

export const usersApi = {
    getAll: (options) => api.get("/users", options),
    remove: (id) => api.delete(`/users/${id}`),
    ban: (id, body) => api.put(`/users/ban/${id}`, body),
    changeRole: (id, role) => api.put("/users/role", { id, role }),
    updateMe: (data) => api.put("/users", data),
    getMyCourses: (options) => api.get("/users/courses", options),
}
