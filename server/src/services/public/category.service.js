const Category = require("../../models/category");

const list = () => Category.find().sort({ _id: 1 }).lean();

module.exports = { list };
