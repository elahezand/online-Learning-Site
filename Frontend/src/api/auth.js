import api from "./client"

export const authApi = {
    login: (identifier, password) => api.post("/auth/login", { identifier, password }, { auth: false }),
    register: (user) => api.post("/auth/register", user, { auth: false }),
    me: (options) => api.get("/auth/me", options),
}
