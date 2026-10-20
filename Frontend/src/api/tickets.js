import api from "./client"

export const ticketsApi = {
    getAll: (options) => api.get("/tickets", options),
    getMine: (options) => api.get("/tickets/user", options),
    getAnswer: (id, options) => api.get(`/tickets/answer/${id}`, options),
    answer: (ticketID, body) => api.post("/tickets/answer", { ticketID, body }),
    create: (ticket) => api.post("/tickets", ticket),
    getDepartments: (options) => api.get("/tickets/departments", options),
    getDepartmentSubs: (departmentId, options) => api.get(`/tickets/departments-subs/${departmentId}`, options),
}
