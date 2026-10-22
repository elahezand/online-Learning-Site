import type { Course } from "../../types/models"

export const categoryIdOf = (course: Pick<Course, "categoryID">) =>
    typeof course.categoryID === "object" ? course.categoryID?._id : course.categoryID
