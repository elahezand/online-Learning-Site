const bcrypt = require("bcrypt");
const User = require("../../models/user");
const BannedPhone = require("../../models/ban-phone");
const AppError = require("../../utils/AppError");
const { signAccessToken } = require("../../utils/tokens");

const SALT_ROUNDS = 12;

const ensurePhoneNotBanned = async (phone) => {
  if (phone && (await BannedPhone.exists({ phone }))) {
    throw AppError.forbidden("This phone number has been banned");
  }
};

const register = async ({ name, username, email, phone, password }) => {
  const taken = await User.exists({ $or: [{ username }, { email }] });
  if (taken) throw AppError.conflict("Username or email is already taken");

  await ensurePhoneNotBanned(phone);

  const isFirstUser = (await User.estimatedDocumentCount()) === 0;
  const user = await User.create({
    name,
    username,
    email,
    phone,
    password: await bcrypt.hash(password, SALT_ROUNDS),
    role: isFirstUser ? "ADMIN" : "USER",
  });

  return { user: user.toJSON(), accessToken: signAccessToken(user._id) };
};

const login = async ({ identifier, password }) => {
  const user = await User.findOne({
    $or: [{ email: identifier.toLowerCase() }, { username: identifier }],
  }).select("+password");

  const valid = user && (await bcrypt.compare(password, user.password));
  if (!valid) throw AppError.unauthorized("Username or password is not correct");

  await ensurePhoneNotBanned(user.phone);

  return { accessToken: signAccessToken(user._id) };
};

module.exports = { register, login, SALT_ROUNDS };
