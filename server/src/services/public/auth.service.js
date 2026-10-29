const { Types } = require("mongoose");
const User = require("../../models/user");
const BannedPhone = require("../../models/ban-phone");
const AuthSession = require("../../models/auth-session");
const AppError = require("../../utils/AppError");
const {
  REFRESH_TOKEN_TTL_SECONDS,
  hashPassword,
  verifyPassword,
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashToken,
  compareTokenHash,
} = require("../../utils/tokens");

const sessionExpiry = () => new Date(Date.now() + REFRESH_TOKEN_TTL_SECONDS * 1000);

const ensurePhoneNotBanned = async (phone) => {
  if (phone && (await BannedPhone.exists({ phone }))) {
    throw AppError.forbidden("This phone number has been banned");
  }
};

const signTokens = (userId, sessionId) => ({
  accessToken: generateToken({ id: String(userId) }),
  refreshToken: generateRefreshToken({ id: String(userId), sid: String(sessionId) }),
});

const startSession = async (userId, userAgent) => {
  const sessionId = new Types.ObjectId();
  const tokens = signTokens(userId, sessionId);
  await AuthSession.create({
    _id: sessionId,
    user: userId,
    tokenHash: hashToken(tokens.refreshToken),
    userAgent,
    expiresAt: sessionExpiry(),
  });
  return tokens;
};

const readRefreshToken = (refreshToken) => {
  const { payload } = verifyRefreshToken(refreshToken);
  if (!payload?.sid) throw AppError.unauthorized("Your session has expired, please log in again");
  return payload;
};

const register = async ({ name, username, email, phone, password }, userAgent) => {
  const taken = await User.exists({ $or: [{ username }, { email }] });
  
  if (taken) throw AppError.conflict("Username or email is already taken");

  await ensurePhoneNotBanned(phone);

  const isFirstUser = (await User.estimatedDocumentCount()) === 0;
  const user = await User.create({
    name,
    username,
    email,
    phone,
    password: await hashPassword(password),
    role: isFirstUser ? "ADMIN" : "USER",
  });

  return { user: user.toJSON(), ...(await startSession(user._id, userAgent)) };
};

const login = async ({ identifier, password }, userAgent) => {
  const user = await User.findOne({
    $or: [{ email: identifier.toLowerCase() }, { username: identifier }],
  }).select("+password");

  const valid = user && (await verifyPassword(password, user.password));
  if (!valid) throw AppError.unauthorized("Username or password is not correct");

  await ensurePhoneNotBanned(user.phone);

  return startSession(user._id, userAgent);
};

const refresh = async ({ refreshToken }) => {
  const { id, sid } = readRefreshToken(refreshToken);

  const session = await AuthSession.findOne({ _id: sid, user: id });
  if (!session) throw AppError.unauthorized("Your session has expired, please log in again");

  if (!compareTokenHash(refreshToken, session.tokenHash)) {
    await session.deleteOne();
    throw AppError.unauthorized("Your session has expired, please log in again");
  }

  const user = await User.findById(id).lean();
  if (!user) throw AppError.unauthorized("This account no longer exists");
  await ensurePhoneNotBanned(user.phone);

  const tokens = signTokens(user._id, session._id);
  session.tokenHash = hashToken(tokens.refreshToken);
  session.expiresAt = sessionExpiry();
  await session.save();

  return tokens;
};

const logout = async ({ refreshToken }) => {
  const { id, sid } = readRefreshToken(refreshToken);
  await AuthSession.deleteOne({ _id: sid, user: id });
  return { message: "Logged out successfully" };
};

module.exports = { register, login, refresh, logout };
