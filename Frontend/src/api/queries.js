import { useQuery } from "@tanstack/react-query"
import { coursesApi } from "./courses"
import { articlesApi } from "./articles"
import { categoriesApi } from "./categories"
import { usersApi } from "./users"
import { commentsApi } from "./comments"
import { contactsApi } from "./contacts"
import { menusApi } from "./menus"
import { discountsApi } from "./discounts"
import { ticketsApi } from "./tickets"
import { infoApi, searchApi, ordersApi } from "./misc"


export const queryKeys = {
    courses: ["courses"],
    course: (shortName) => ["courses", "detail", shortName],
    relatedCourses: (shortName) => ["courses", "related", shortName],
    popularCourses: ["courses", "popular"],
    presellCourses: ["courses", "presell"],
    categoryCourses: (categoryName) => ["courses", "category", categoryName],
    sessions: ["sessions"],
    session: (shortName, sessionId) => ["sessions", shortName, sessionId],
    articles: ["articles"],
    article: (shortName) => ["articles", "detail", shortName],
    categories: ["categories"],
    users: ["users"],
    myCourses: ["me", "courses"],
    comments: ["comments"],
    contacts: ["contacts"],
    mainMenu: ["menus", "main"],
    topbarMenu: ["menus", "topbar"],
    menus: ["menus", "all"],
    discounts: ["discounts"],
    tickets: ["tickets"],
    myTickets: ["me", "tickets"],
    ticketAnswer: (id) => ["tickets", "answer", id],
    departments: ["tickets", "departments"],
    departmentSubs: (id) => ["tickets", "departments", id],
    myOrders: ["me", "orders"],
    indexInfo: ["infos", "index"],
    adminDashboard: ["infos", "p-admin"],
    search: (value) => ["search", value],
}

// Small helper: every query function receives { signal } so requests are
// cancelled when the component unmounts or the key changes.
const q = (queryKey, fetcher, options) =>
    ({ queryKey, queryFn: ({ signal }) => fetcher({ signal }), ...options })

/* ---------- Courses & sessions ---------- */
export const useCourses = (options) => useQuery(q(queryKeys.courses, coursesApi.getAll, options))
export const usePopularCourses = () => useQuery(q(queryKeys.popularCourses, coursesApi.getPopular))
export const usePresellCourses = () => useQuery(q(queryKeys.presellCourses, coursesApi.getPresell))
export const useCategoryCourses = (categoryName) =>
    useQuery(q(queryKeys.categoryCourses(categoryName), o => coursesApi.getByCategory(categoryName, o),
        { enabled: Boolean(categoryName) }))
export const useCourse = (shortName) =>
    useQuery(q(queryKeys.course(shortName), o => coursesApi.getOne(shortName, o), { enabled: Boolean(shortName) }))
export const useRelatedCourses = (shortName) =>
    useQuery(q(queryKeys.relatedCourses(shortName), o => coursesApi.getRelated(shortName, o), { enabled: Boolean(shortName) }))
export const useSessions = () => useQuery(q(queryKeys.sessions, coursesApi.getAllSessions))
export const useSession = (shortName, sessionId) =>
    useQuery(q(queryKeys.session(shortName, sessionId), o => coursesApi.getSession(shortName, sessionId, o),
        { enabled: Boolean(shortName && sessionId) }))

/* ---------- Articles & categories ---------- */
export const useArticles = () => useQuery(q(queryKeys.articles, articlesApi.getAll))
export const useArticle = (shortName) =>
    useQuery(q(queryKeys.article(shortName), o => articlesApi.getOne(shortName, o), { enabled: Boolean(shortName) }))
export const useCategories = () => useQuery(q(queryKeys.categories, categoriesApi.getAll))

/* ---------- Users ---------- */
export const useUsers = () => useQuery(q(queryKeys.users, usersApi.getAll))
export const useMyCourses = () => useQuery(q(queryKeys.myCourses, usersApi.getMyCourses))
export const useMyOrders = () => useQuery(q(queryKeys.myOrders, ordersApi.getMine))

/* ---------- Admin lists ---------- */
export const useComments = () => useQuery(q(queryKeys.comments, commentsApi.getAll))
export const useContacts = () => useQuery(q(queryKeys.contacts, contactsApi.getAll))
export const useDiscounts = () => useQuery(q(queryKeys.discounts, discountsApi.getAll))
export const useAdminDashboard = () => useQuery(q(queryKeys.adminDashboard, infoApi.getAdminDashboard))

/* ---------- Menus ---------- */
export const useMainMenu = () => useQuery(q(queryKeys.mainMenu, menusApi.getMain, { staleTime: 10 * 60 * 1000 }))
export const useTopbarMenu = () => useQuery(q(queryKeys.topbarMenu, menusApi.getTopbar, { staleTime: 10 * 60 * 1000 }))
export const useMenus = () => useQuery(q(queryKeys.menus, menusApi.getAll))

/* ---------- Tickets ---------- */
export const useTickets = () => useQuery(q(queryKeys.tickets, ticketsApi.getAll))
export const useMyTickets = () => useQuery(q(queryKeys.myTickets, ticketsApi.getMine))
export const useTicketAnswer = (id) =>
    useQuery(q(queryKeys.ticketAnswer(id), o => ticketsApi.getAnswer(id, o), { enabled: Boolean(id) }))
export const useDepartments = () => useQuery(q(queryKeys.departments, ticketsApi.getDepartments, { staleTime: Infinity }))
export const useDepartmentSubs = (departmentId) =>
    useQuery(q(queryKeys.departmentSubs(departmentId), o => ticketsApi.getDepartmentSubs(departmentId, o),
        { enabled: Boolean(departmentId) && departmentId !== "-1", staleTime: Infinity }))

/* ---------- Site info & search ---------- */
export const useIndexInfo = () => useQuery(q(queryKeys.indexInfo, infoApi.getIndex))
export const useSearch = (value) =>
    useQuery(q(queryKeys.search(value), o => searchApi.search(value, o),
        { enabled: Boolean(value && value.trim()), placeholderData: prev => prev }))
