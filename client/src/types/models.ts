export type Id = string

/** 0/1 flags as the backend sends them */
export type Flag = 0 | 1

export type Role = "ADMIN" | "USER"

export interface Notification {
    _id: Id
    msg: string
    seen?: Flag
}

export interface User {
    _id: Id
    name: string
    username: string
    email: string
    phone: string
    role: Role
    profile?: string
    notifications?: Notification[]
    createdAt?: string
    updatedAt?: string
}

export interface Category {
    _id: Id
    title: string
    name: string
}

export interface Course {
    _id: Id
    name: string
    shortName: string
    description?: string
    cover?: string
    price: number
    discount?: number
    support?: string
    status?: "start" | "presell"
    isComplete?: Flag
    creator?: string
    categoryID?: Category | Id
    courseAverageScore?: number
    registers?: number
    createdAt?: string
    updatedAt?: string
}

export interface Session {
    _id: Id
    title: string
    time: string
    free: Flag
    video?: string
    course?: Pick<Course, "_id" | "name" | "shortName">
    createdAt?: string
    updatedAt?: string
}

export interface CommentAnswer {
    body: string
    creator?: Pick<User, "name" | "role" | "updatedAt">
}

export interface Comment {
    _id: Id
    body: string
    score: number
    answer: Flag
    course?: string
    creator?: Pick<User, "_id" | "name" | "email" | "phone" | "role" | "updatedAt">
    answerContent?: CommentAnswer | null
    createdAt?: string
}

export interface CourseDetail extends Omit<Course, "creator" | "categoryID"> {
    creator?: Pick<User, "name" | "profile">
    categoryID?: Category
    comments?: Comment[]
    sessions?: Session[]
    courseStudentsCount?: number
    isUserRegisteredToThisCourse?: boolean
}

export interface SessionDetail {
    session: Session
    sessions: Session[]
}

export interface Article {
    _id: Id
    title: string
    shortName: string
    description?: string
    body?: string
    cover?: string
    publish: Flag
    creator?: Pick<User, "name" | "username">
    categoryID?: Category
    createdAt?: string
    updatedAt?: string
}

export interface Contact {
    _id: Id
    name: string
    email: string
    phone: string
    body: string
    answer: Flag
    createdAt?: string
}

export type Priority = 1 | 2 | 3

/** The backend sends either an id or a populated document, depending on the endpoint */
export type Ref<T> = Id | T

export interface Ticket {
    _id: Id
    title: string
    body: string
    user?: Ref<Pick<User, "_id" | "name">> | null
    course?: Ref<Pick<Course, "_id" | "name">> | null
    departmentID?: Ref<Department> | null
    departmentSubID?: Ref<Department> | null
    priority?: Priority
    /** 1 once the support team has replied */
    answer: Flag
    /** 1 for a reply, 0 for the ticket a user opened */
    isAnswer?: Flag
    parent?: Ref<{ _id: Id }> | null
    createdAt?: string
    updatedAt?: string
}

export interface TicketAnswer {
    ticket?: string
    answer?: string | null
}

export interface TicketMessage {
    _id: Id
    body: string
    /** 1 when the message comes from the support team */
    isAnswer: Flag
    user?: Ref<Pick<User, "_id" | "name" | "role">> | null
    createdAt?: string
}

export interface TicketThread {
    ticket?: Partial<Ticket>
    messages: TicketMessage[]
}

export interface Department {
    _id: Id
    title: string
}

export interface Order {
    _id: Id
    course?: Pick<Course, "_id" | "name" | "shortName" | "cover" | "price" | "isComplete">
    price: number
    isComplete?: Flag
    createdAt?: string
}

export interface MyCourse {
    _id: Id
    price: number
    course?: Pick<Course, "_id" | "name" | "shortName" | "cover" | "price" | "isComplete">
}

export interface Menu {
    _id: Id
    title: string
    href: string
    parent?: Pick<Menu, "_id" | "title"> | Id | null
    submenus?: Menu[]
}

export interface Discount {
    _id: Id
    code: string
    percent: number
    max: number
    uses: number
    creator?: string
    course?: Id
    createdAt?: string
}

export interface IndexInfo {
    usersCount?: number
    coursesCount?: number
    totalTime?: number
    email?: string
    phone?: string
}

export interface AdminDashboardInfo {
    adminName?: string
    infos?: { title: string; count: number }[]
    lastUsers?: User[]
}

export interface SearchResult {
    allResultCourses?: Course[]
    allResultArticles?: Article[]
}

export interface AuthTokens {
    accessToken?: string
    refreshToken?: string
}
