import { GuestOnly, RequireAuth, RequireRole } from "../features/auth/RouteGuards"
import PublicLayout from "../components/layout/PublicLayout"

// Public pages
import Home from "../pages/public/Home"
import Courses from "../pages/public/Courses"
import CourseInfo from "../pages/public/CourseInfo"
import SessionInfo from "../pages/public/SessionInfo"
import Category from "../pages/public/Category"
import Articles from "../pages/public/Articles"
import ArticleInfo from "../pages/public/ArticleInfo"
import Search from "../pages/public/Search"
import Contact from "../pages/public/Contact"
import Login from "../pages/public/Login"
import Register from "../pages/public/Register"

// Admin panel (/p-admin)
import AdminLayout from "../pages/admin/AdminLayout"
import AdminDashboard from "../pages/admin/Dashboard"
import AdminUsers from "../pages/admin/Users"
import AdminCourses from "../pages/admin/Courses"
import AdminSessions from "../pages/admin/Sessions"
import AdminCategories from "../pages/admin/Categories"
import AdminArticles from "../pages/admin/Articles"
import AdminArticleDraft from "../pages/admin/ArticleDraft"
import AdminComments from "../pages/admin/Comments"
import AdminContacts from "../pages/admin/Contacts"
import AdminMenus from "../pages/admin/Menus"
import AdminDiscounts from "../pages/admin/Discounts"
import AdminSiteWideDiscount from "../pages/admin/SiteWideDiscount"
import AdminTickets from "../pages/admin/Tickets"
import AddUserForm from "../features/users/AddUserForm"

// User account (/my-account)
import AccountLayout from "../pages/account/AccountLayout"
import AccountDashboard from "../pages/account/Dashboard"
import AccountCourses from "../pages/account/Courses"
import AccountOrders from "../pages/account/Orders"
import AccountWallet from "../pages/account/Wallet"
import AccountProfile from "../pages/account/Profile"
import AccountTickets from "../pages/account/Tickets"
import AccountTicket from "../pages/account/Ticket"
import AccountNewTicket from "../pages/account/NewTicket"

const routes = [
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
            { path: "sessions/:page?", element: <AdminSessions /> },
            { path: "categories/:page?", element: <AdminCategories /> },
            { path: "articles/:page?", element: <AdminArticles /> },
            { path: "article-draft/:shortName", element: <AdminArticleDraft /> },
            { path: "comments/:page?", element: <AdminComments /> },
            { path: "contacts/:page?", element: <AdminContacts /> },
            { path: "menu/:page?", element: <AdminMenus /> },
            { path: "discounts/:page?", element: <AdminDiscounts /> },
            { path: "siteWide-discounts", element: <AdminSiteWideDiscount /> },
            { path: "tickets/:page?", element: <AdminTickets /> },
        ],
    },

]

export default routes
