const Category = require("../../models/category");
const Course = require("../../models/course");

const list = async () => {
  const [categories, counts] = await Promise.all([
    Category.find().sort({ _id: 1 }).lean(),
    Course.aggregate([{ $group: { _id: "$categoryID", count: { $sum: 1 } } }]),
  ]);
  const countById = new Map(counts.map((row) => [String(row._id), row.count]));
  return categories.map((category) => ({ ...category, coursesCount: countById.get(String(category._id)) ?? 0 }));
};

module.exports = { list };
