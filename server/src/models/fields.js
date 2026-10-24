const { Schema } = require("mongoose");

const flag = (defaultValue = 0) => ({ type: Number, enum: [0, 1], default: defaultValue });

const ref = (model, required = false) => ({
  type: Schema.Types.ObjectId,
  ref: model,
  ...(required && { required: [true, `${model} is required`] }),
});

const requiredString = (label, extra = {}) => ({
  type: String,
  trim: true,
  required: [true, `${label} is required`],
  ...extra,
});

const hideInternals = {
  versionKey: false,
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
};

module.exports = { flag, ref, requiredString, hideInternals };
