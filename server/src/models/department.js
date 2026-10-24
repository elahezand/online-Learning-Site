const { Schema, model } = require("mongoose");
const { requiredString } = require("./fields");

const departmentSchema = new Schema(
  {
    title: requiredString("Title", { maxlength: 80 }),
  },
  { timestamps: true }
);

module.exports = model("Department", departmentSchema);
