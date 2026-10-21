/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL?: string
    readonly VITE_FILES_URL?: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

declare module "swiper/css"
declare module "swiper/css/pagination"
