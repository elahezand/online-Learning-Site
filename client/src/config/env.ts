const trimSlash = (url: string) => url.replace(/\/+$/, "")

const env = {
    apiUrl: trimSlash(import.meta.env.VITE_API_URL || "http://localhost:4000/v1"),
    filesUrl: trimSlash(import.meta.env.VITE_FILES_URL || "http://localhost:4000"),
}

export const coverUrl = (fileName?: string) =>
    fileName ? `${env.filesUrl}/courses/covers/${fileName}` : undefined

export default env
