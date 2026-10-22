import type { Course } from "../../types/models"

/* A course's category id, whether categoryID is populated or not */
export const categoryIdOf = (course: Pick<Course, "categoryID">) =>
    typeof course.categoryID === "object" ? course.categoryID?._id : course.categoryID
