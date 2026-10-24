const Menu = require("../../models/menu");

const buildTree = (menus) => {
  const children = new Map();
  for (const menu of menus) {
    if (!menu.parent) continue;
    const key = String(menu.parent);
    children.set(key, [...(children.get(key) ?? []), menu]);
  }
  return menus
    .filter((menu) => !menu.parent)
    .map((menu) => ({ ...menu, submenus: children.get(String(menu._id)) ?? [] }));
};

const listTree = async () => buildTree(await Menu.find().sort({ _id: 1 }).lean());

const listAll = () => Menu.find().populate("parent", "title href").sort({ _id: 1 }).lean();

const listTopbar = () => Menu.find({ parent: { $ne: null } }).sort({ _id: 1 }).lean();

module.exports = { listTree, listAll, listTopbar };
