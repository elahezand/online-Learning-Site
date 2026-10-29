const { Schema, model } = require("mongoose");
const { requiredString, hideInternals } = require("./fields");

const ROLES = ["ADMIN", "USER"];

const walletSchema = new Schema(
  {
    balance: { type: Number, default: 0, min: [0, "Wallet balance can't be negative"] },
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    username: requiredString("Username", { unique: true, minlength: 3, maxlength: 30 }),
    email: requiredString("Email", { unique: true, lowercase: true }),
    password: { type: String, required: [true, "Password is required"], select: false },
    name: requiredString("Name", { minlength: 3, maxlength: 60 }),
    phone: { type: String, trim: true },
    role: { type: String, enum: ROLES, default: "USER" },
    wallet: { type: walletSchema, default: () => ({}) },
  },
  { timestamps: true, toJSON: hideInternals, toObject: hideInternals }
);

module.exports = model("User", userSchema);
module.exports.ROLES = ROLES;