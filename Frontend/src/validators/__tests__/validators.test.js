import { contactSchema, courseSchema, discountSchema, loginSchema, profileSchema, registerSchema, roleSchema } from ".."

const firstError = (result) => result.error.issues[0].message

test("login needs both fields", () => {
    const result = loginSchema.safeParse({ username: " ", password: "" })
    expect(result.success).toBe(false)
    expect(firstError(result)).toBe("Username or email is required")
})

test("register checks email and phone formats", () => {
    const result = registerSchema.safeParse({ name: "Sara Ahmadi", username: "sara", email: "sara@", phonenumber: "123", password: "12345678" })
    const messages = result.error.issues.map(issue => issue.message)
    expect(messages).toContain("Enter a valid email address")
    expect(messages).toContain("Enter a valid phone number, e.g. 09121234567")
})

test("valid register data passes and is trimmed", () => {
    const result = registerSchema.safeParse({ name: "  Sara Ahmadi ", username: "sara_a", email: "sara@mail.com", phonenumber: "09121234567", password: "12345678" })
    expect(result.success).toBe(true)
    expect(result.data.name).toBe("Sara Ahmadi")
})

test("contact message has a minimum length", () => {
    const result = contactSchema.safeParse({ name: "Sara", email: "s@mail.com", phone: "09121234567", body: "hi" })
    expect(firstError(result)).toBe("Message must be at least 10 characters")
})

test("numbers are parsed from inputs", () => {
    const result = discountSchema.safeParse({ code: "OFF20", percent: "20", max: "5", course: "c1" })
    expect(result.success).toBe(true)
    expect(result.data.percent).toBe(20)
    expect(discountSchema.safeParse({ code: "OFF20", percent: "120", max: "5", course: "c1" }).success).toBe(false)
})

test("course needs a category and a cover image", () => {
    const result = courseSchema.safeParse({ name: "React", shortName: "react", price: "0", support: "Telegram", categoryID: "", status: "start", description: "A long enough description", cover: "" })
    const messages = result.error.issues.map(issue => issue.message)
    expect(messages).toContain("Please select a category")
    expect(messages).toContain("Cover is required")

    const cover = new File(["x"], "cover.png", { type: "image/png" })
    expect(courseSchema.safeParse({ name: "React", shortName: "react", price: "0", support: "Telegram", categoryID: "c1", status: "start", description: "A long enough description", cover }).success).toBe(true)
})

test("profile password is optional but must match its repeat", () => {
    const base = { name: "Sara Ahmadi", username: "sara", email: "s@mail.com", phone: "09121234567" }
    expect(profileSchema.safeParse({ ...base, password: "", confirmPassword: "" }).success).toBe(true)
    const result = profileSchema.safeParse({ ...base, password: "12345678", confirmPassword: "123" })
    expect(firstError(result)).toBe("Passwords do not match")
})

test("role is normalised to upper case", () => {
    expect(roleSchema.parse(" admin ")).toBe("ADMIN")
    expect(roleSchema.safeParse("owner").success).toBe(false)
})
