import api from "./client"

export const menusApi = {
    getMain: (options) => api.get("/menus", options),
    getTopbar: (options) => api.get("/menus/topbar", options),
    getAll: (options) => api.get("/menus/all", options),
    create: ({ title, href, parent }) => api.post("/menus", { title, href, parent }),
    remove: (id) => api.delete(`/menus/${id}`),
}
