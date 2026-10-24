const Menu = require("../../models/menu");
const AppError = require("../../utils/AppError");

const create = async (input) => {
  if (input.parent && !(await Menu.exists({ _id: input.parent }))) throw AppError.notFound("Parent menu not found");
  return Menu.create(input);
};

const remove = async (id) => {
  const menu = await Menu.findByIdAndDelete(id).lean();
  if (!menu) throw AppError.notFound("Menu not found");
  await Menu.deleteMany({ parent: menu._id });
  return menu;
};

module.exports = { create, remove };
