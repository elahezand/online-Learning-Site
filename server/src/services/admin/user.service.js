const User = require("../../models/user");
const BannedPhone = require("../../models/ban-phone");
const AuthSession = require("../../models/auth-session");
const AppError = require("../../utils/AppError");
const { ensureUnique, buildChanges } = require("../user/user.service");

const paginate = require("../../utils/paginate");
const { searchFilter } = require("../shared/filter");

const SEARCH_FIELDS = ["name", "username", "email", "phone"];

const buildFilter = async ({ search, role, status }) => {
  const bannedPhones = await BannedPhone.distinct("phone");
  return {
    phone: status === "banned" ? { $in: bannedPhones } : { $nin: bannedPhones },
    ...(role && { role }),
    ...(search && { $or: SEARCH_FIELDS.map((field) => searchFilter(field, search)) }),
  };
};

const list = async ({ page, limit, ...query }) =>
  paginate(User, { filter: await buildFilter(query), page, limit });

const edit = async (admin, id, input) => {
  if (String(admin._id) === String(id) && input.role && input.role !== "ADMIN") {
    throw AppError.badRequest("You can't remove your own admin role");
  }
  await ensureUnique(id, input);
  const user = await User.findByIdAndUpdate(id, await buildChanges(input), { new: true, runValidators: true });
  if (!user) throw AppError.notFound("User not found");
  return { user: user.toJSON() };
};

const remove = async (admin, id) => {
  if (String(admin._id) === String(id)) throw AppError.badRequest("You can't delete your own account");
  const user = await User.findByIdAndDelete(id).lean();
  if (!user) throw AppError.notFound("User not found");
  await AuthSession.deleteMany({ user: user._id });
  return { message: "User deleted successfully" };
};

const ban = async (admin, id) => {
  if (String(admin._id) === String(id)) throw AppError.badRequest("You can't ban your own account");
  const user = await User.findById(id).lean();
  if (!user) throw AppError.notFound("User not found");
  if (user.role === "ADMIN") throw AppError.badRequest("Admins can't be banned, change their role first");
  if (!user.phone) throw AppError.badRequest("This user has no phone number to ban");

  await BannedPhone.updateOne({ phone: user.phone }, { $setOnInsert: { phone: user.phone } }, { upsert: true });
  await AuthSession.deleteMany({ user: user._id });
  return { msg: "User banned successfully" };
};


const unban = async (id) => {
  const user = await User.findById(id).lean();
  if (!user) throw AppError.notFound("User not found");
  await BannedPhone.deleteOne({ phone: user.phone });
  return { msg: "User unbanned successfully" };
};

const changeRole = async (admin, { id, role }) => {
  if (String(admin._id) === String(id) && role !== "ADMIN") {
    throw AppError.badRequest("You can't remove your own admin role");
  }
  const user = await User.findByIdAndUpdate(id, { role }, { new: true }).lean();
  if (!user) throw AppError.notFound("User not found");
  return { msg: `User role changed to ${role} successfully` };
};

module.exports = { list, edit, remove, ban, changeRole,unban };
