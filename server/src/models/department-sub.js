const { Schema, model } = require("mongoose");
const { ref, requiredString } = require("./fields");

const departmentSubSchema = new Schema(
  {
    title: requiredString("Title", { maxlength: 80 }),
    parent: ref("Department", true),
  },
  { timestamps: true }
);

departmentSubSchema.index({ parent: 1 });

module.exports = model("DepartmentSub", departmentSubSchema);
