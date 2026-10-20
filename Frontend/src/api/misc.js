import api from "./client"

export const infoApi = {
    getIndex: (options) => api.get("/infos/index", options),
    getAdminDashboard: (options) => api.get("/infos/p-admin", options),
}

export const searchApi = {
    search: (value, options) => api.get(`/search/${encodeURIComponent(value)}`, options),
}

export const newsletterApi = {
    subscribe: (email) => api.post("/newsletters", { email }, { auth: false }),
}

export const ordersApi = {
    getMine: (options) => api.get("/orders", options),
}

export const notificationsApi = {
    markSeen: (id) => api.put(`/notifications/see/${id}`),
}
