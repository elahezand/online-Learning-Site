
const trimSlash = (url) => url.replace(/\/+$/, "")

const env = {
    apiUrl: trimSlash(process.env.REACT_APP_API_URL || "http://localhost:4000/v1"),
    filesUrl: trimSlash(process.env.REACT_APP_FILES_URL || "http://localhost:4000"),
}

export const coverUrl = (fileName) =>
    fileName ? `${env.filesUrl}/courses/covers/${fileName}` : undefined

export default env
