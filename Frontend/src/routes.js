import Index from "./pages/Index"
import CourseInfo from "./pages/courseInfo"
import Category from "./pages/category"
import ArticleInfo from "./pages/articleInfo"
import Articles from "./pages/articles"
import Courses from "./pages/courses"
import Register from "./pages/register"
import Login from "./pages/login"
import Contact from "./pages/contact"
import Search from "./pages/search"
import SessionInfo from "./pages/sessionInfo"

import AdminPanelProtection from "./utils/AdminPanelProtection"
import AdminPanel from "./pages/p-admin/p-admin"
import Users from "./pages/p-admin/users"
import PanelAdminIndex from "./pages/p-admin/index"
import Categories from "./pages/p-admin/categories"
import CoursesPanel from "./pages/p-admin/courses"
import Contacts from "./pages/p-admin/contacts"
import ArticlesPanel from "./pages/p-admin/articles"
import Sessions from "./pages/p-admin/sessions"
import Menu from "./pages/p-admin/menu"
import CommentsPanel from "./pages/p-admin/comments"
import Discounts from "./pages/p-admin/discounts"
import ArticleDraft from "./pages/p-admin/article-draft"
import TicketsAdmin from "./pages/p-admin/tickets"
import SiteWideDiscount from "./pages/p-admin/siteWideDiscount"
import AddNewUser from "./components/templates/p-admin/AddNewUser/AddNewUser"

import UserPanel from "./pages/p-user/p-user"
import UserPanelIndex from "./pages/p-user/index"
import CoursesUser from "./pages/p-user/courses"
import Orders from "./pages/p-user/orders"
import Wallet from "./pages/p-user/wallet"
import UserDetail from "./pages/p-user/userDetail"
import Tickets from "./pages/p-user/tickets"
import AddNewTicket from "./pages/p-user/newticket"
import Ticket from "./pages/p-user/ticket"

const routes = [
    { path: "/", element: <Index /> },
    { path: "/category-info/:categoryName/:page", element: <Category /> },
    { path: "/articles/:page", element: <Articles /> },
    { path: "/article-info/:articleName", element: <ArticleInfo /> },
    { path: "/course-info/:courseName/:page", element: <CourseInfo /> },
    { path: "/courses/:page", element: <Courses /> },
    { path: "/register", element: <Register /> },
    { path: "/login", element: <Login /> },
    { path: "/contact-Us", element: <Contact /> },
    { path: "/search/:value", element: <Search /> },
    { path: "/:courseName/:sessionId", element: <SessionInfo /> },

    {
        path: "/p-admin", element:
            <AdminPanelProtection>
                <AdminPanel />
            </AdminPanelProtection>,
        children: [
            { path: "", element: <PanelAdminIndex /> },
            { path: "users/:page", element: <Users /> },
            { path: "new-user", element: <AddNewUser /> },
            { path: "courses/:page", element: <CoursesPanel /> },
            { path: "categories/:page", element: <Categories /> },
            { path: "contacts/:page", element: <Contacts /> },
            { path: "articles/:page", element: <ArticlesPanel /> },
            { path: "sessions/:page", element: <Sessions /> },
            { path: "menu/:page", element: <Menu /> },
            { path: "comments/:page", element: <CommentsPanel /> },
            { path: "discounts/:page", element: <Discounts /> },
            { path: "article-draft/:shortName", element: <ArticleDraft /> },
            { path: "tickets/:page", element: <TicketsAdmin /> },
            { path: "siteWide-discounts", element: <SiteWideDiscount /> },


        ]
    },
    {
        path: "/my-account", element: <UserPanel />,
        children: [
            { path: "", element: <UserPanelIndex /> },
            { path: "courses/:page", element: <CoursesUser /> },
            { path: "orders/:page", element: <Orders /> },
            { path: "wallet", element: <Wallet /> },
            { path: "detail", element: <UserDetail /> },
            { path: "tickets/:page", element: <Tickets /> },
            { path: "add-newTicket", element: <AddNewTicket /> },
            { path: "ticket/answer/:id", element: <Ticket /> },

        ]
    },
]

export default routes