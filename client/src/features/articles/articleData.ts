import type { ArticleData } from "../../validators"

export const buildArticleData = (data: ArticleData) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== "") formData.append(key, value as string | Blob)
    })
    return formData
}
