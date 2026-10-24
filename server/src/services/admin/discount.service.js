const Off = require("../../models/off");
const Course = require("../../models/course");
const AppError = require("../../utils/AppError");

const create = async (user, input) => {
  if (!(await Course.exists({ _id: input.course }))) throw AppError.notFound("Course not found");
  if (await Off.exists({ code: input.code, course: input.course })) {
    throw AppError.conflict("This code already exists for this course");
  }
  return Off.create({ ...input, uses: 0, creator: user._id });
};

const list = async () => {
  const discounts = await Off.find().populate("creator", "name").sort({ _id: -1 }).lean();
  return discounts.map((discount) => ({ ...discount, creator: discount.creator?.name ?? null }));
};

const remove = async (id) => {
  const discount = await Off.findByIdAndDelete(id).lean();
  if (!discount) throw AppError.notFound("Discount code not found");
  return discount;
};

const setOnAllCourses = async ({ discount }) => {
  await Course.updateMany({}, { discount });
  return { message: `A ${discount}% discount was set on all courses` };
};

const removeFromAllCourses = async () => {
  await Course.updateMany({}, { discount: 0 });
  return { success: true, message: "Discounts were removed from all courses" };
};

module.exports = { create, list, remove, setOnAllCourses, removeFromAllCourses };
