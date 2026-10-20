import api from "./client"

export const contactsApi = {
    send: (message) => api.post("/contact", message, { auth: false }),
    getAll: (options) => api.get("/contact", options),
    answer: (email, answer) => api.post("/contact/answer", { email, answer }),
    remove: (id) => api.delete(`/contact/${id}`),
}
