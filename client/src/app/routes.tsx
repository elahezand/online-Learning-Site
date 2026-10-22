import { lazy } from "react"
import type { RouteObject } from "react-router-dom"
import { GuestOnly, RequireAuth, RequireRole } from "../features/auth/RouteGuards"
import PublicLayout from "../components/layout/PublicLayout"

// Public pages
import Home from "../pages/public/Home"
const Courses = lazy(() => import("../pages/public/Courses"))
const CourseInfo = lazy(() => import("../pages/public/CourseInfo"))
const SessionInfo = lazy(() => import("../pages/public/SessionInfo"))
const Category = lazy(() => import("../pages/public/Category"))
const Articles = lazy(() => import("../pages/public/Articles"))
const ArticleInfo = lazy(() => import("../pages/public/ArticleInfo"))
const Search = lazy(() => import("../pages/public/Search"))
const Contact = lazy(() => import("../pages/public/Contact"))
const Login = lazy(() => import("../pages/public/Login"))
const Register = lazy(() => import("../pages/public/Register"))

// Admin panel (/p-admin)
const AdminLayout = lazy(() => import("../components/layout/admin/AdminLayout"))
const AdminDashboard = lazy(() => import("../pages/admin/Dashboard"))
const AdminUsers = lazy(() => import("../pages/admin/Users"))
const AdminCourses = lazy(() => import("../pages/admin/Courses"))
const AdminEditCourse = lazy(() => import("../pages/admin/EditCourse"))
const AdminSessions = lazy(() => import("../pages/admin/Sessions"))
const AdminCategories = lazy(() => import("../pages/admin/Categories"))
const AdminArticles = lazy(() => import("../pages/admin/Articles"))
const AdminEditArticle = lazy(() => import("../pages/admin/EditArticle"))
const AdminComments = lazy(() => import("../pages/admin/Comments"))
const AdminContacts = lazy(() => import("../pages/admin/Contacts"))
const AdminMenus = lazy(() => import("../pages/admin/Menus"))
const AdminDiscounts = lazy(() => import("../pages/admin/Discounts"))
const AdminSiteWideDiscount = lazy(() => import("../pages/admin/SiteWideDiscount"))
const AdminTickets = lazy(() => import("../pages/admin/Tickets"))
const AdminTicket = lazy(() => import("../pages/admin/Ticket"))
const AddUserForm = lazy(() => import("../features/users/AddUserForm"))

// User account (/my-account)
const AccountLayout = lazy(() => import("../components/layout/account/AccountLayout"))
const AccountDashboard = lazy(() => import("../pages/account/Dashboard"))
const AccountCourses = lazy(() => import("../pages/account/Courses"))
const AccountOrders = lazy(() => import("../pages/account/Orders"))
const AccountWallet = lazy(() => import("../pages/account/Wallet"))
const AccountProfile = lazy(() => import("../pages/account/Profile"))
const AccountTickets = lazy(() => import("../pages/account/Tickets"))
const AccountTicket = lazy(() => import("../pages/account/Ticket"))
const AccountNewTicket = lazy(() => import("../pages/account/NewTicket"))

const routes: RouteObject[] = [
    // ---------- public (shared header + footer)
    {
        element: <PublicLayout />,
        children: [
            { path: "/", element: <Home /> },
            { path: "/courses/:page?", element: <Courses /> },
            { path: "/course-info/:courseName/:page?", element: <CourseInfo /> },
            { path: "/category-info/:categoryName/:page?", element: <Category /> },
            { path: "/articles/:page?", element: <Articles /> },
            { path: "/article-info/:articleName", element: <ArticleInfo /> },
            { path: "/search/:value", element: <Search /> },
            { path: "/contact-Us", element: <Contact /> },
            { path: "/login", element: <GuestOnly><Login /></GuestOnly> },
            { path: "/register", element: <GuestOnly><Register /></GuestOnly> },
            { path: "/:courseName/:sessionId", element: <SessionInfo /> },
            // /my-account lives inside the public layout (same header + footer)
            {
                path: "/my-account",
                element: <RequireAuth><AccountLayout /></RequireAuth>,
                children: [
                    { path: "", element: <AccountDashboard /> },
                    { path: "courses/:page?", element: <AccountCourses /> },
                    { path: "orders/:page?", element: <AccountOrders /> },
                    { path: "wallet", element: <AccountWallet /> },
                    { path: "detail", element: <AccountProfile /> },
                    { path: "tickets/:page?", element: <AccountTickets /> },
                    { path: "ticket/:id", element: <AccountTicket /> },
                    { path: "ticket/answer/:id", element: <AccountTicket /> },
                    { path: "add-newTicket", element: <AccountNewTicket /> },
                ],
            },
        ],
    },

    // ---------- admin
    {
        path: "/p-admin",
        element: <RequireRole role="ADMIN"><AdminLayout /></RequireRole>,
        children: [
            { path: "", element: <AdminDashboard /> },
            { path: "users/:page?", element: <AdminUsers /> },
            { path: "new-user", element: <AddUserForm /> },
            { path: "courses/:page?", element: <AdminCourses /> },
            { path: "course/:id/edit", element: <AdminEditCourse /> },
            { path: "sessions/:page?", element: <AdminSessions /> },
            { path: "categories/:page?", element: <AdminCategories /> },
            { path: "articles/:page?", element: <AdminArticles /> },
            { path: "article/:shortName/edit", element: <AdminEditArticle /> },
            { path: "comments/:page?", element: <AdminComments /> },
            { path: "contacts/:page?", element: <AdminContacts /> },
            { path: "menu/:page?", element: <AdminMenus /> },
            { path: "discounts/:page?", element: <AdminDiscounts /> },
            { path: "siteWide-discounts", element: <AdminSiteWideDiscount /> },
            { path: "tickets/:page?", element: <AdminTickets /> },
            { path: "ticket/:id", element: <AdminTicket /> },
        ],
    },

]

export default routes
