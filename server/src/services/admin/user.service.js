const User = require("../../models/user");
const BannedPhone = require("../../models/ban-phone");
const AuthSession = require("../../models/auth-session");
const AppError = require("../../utils/AppError");
const { ensureUnique, buildChanges } = require("../user/user.service");

const list = () => User.find().sort({ _id: -1 }).lean();

const edit = async (id, input) => {
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
  if (!user.phone) throw AppError.badRequest("This user has no phone number to ban");

  await BannedPhone.updateOne({ phone: user.phone }, { $setOnInsert: { phone: user.phone } }, { upsert: true });
  await AuthSession.deleteMany({ user: user._id });
  return { msg: "User banned successfully" };
};

const changeRole = async (admin, { id, role }) => {
  if (String(admin._id) === String(id) && role !== "ADMIN") {
    throw AppError.badRequest("You can't remove your own admin role");
  }
  const user = await User.findByIdAndUpdate(id, { role }, { new: true }).lean();
  if (!user) throw AppError.notFound("User not found");
  return { msg: `User role changed to ${role} successfully` };
};

module.exports = { list, edit, remove, ban, changeRole };
