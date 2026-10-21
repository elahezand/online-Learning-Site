import { z } from "zod"
import { email } from "./fields"

export const newsletterSchema = z.object({ email })
