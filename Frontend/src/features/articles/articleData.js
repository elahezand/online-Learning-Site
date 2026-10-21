export const buildArticleData = (data) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== "") formData.append(key, value)
    })
    return formData
}
