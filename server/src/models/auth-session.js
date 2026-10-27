const { Schema, model } = require("mongoose");
const { ref } = require("./fields");

const authSessionSchema = new Schema(
  {
    user: ref("User", true),
    tokenHash: { type: String, required: true },
    userAgent: { type: String, trim: true, maxlength: 300 },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

authSessionSchema.index({ user: 1 });
authSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = model("AuthSession", authSessionSchema);
