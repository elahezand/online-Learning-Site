const { Schema, model } = require("mongoose");
const { flag, ref, requiredString } = require("./fields");

const PRIORITIES = [1, 2, 3];

const ticketSchema = new Schema(
  {
    departmentID: ref("Department", true),
    departmentSubID: ref("DepartmentSub", true),
    priority: { type: Number, enum: PRIORITIES, default: 2 },
    title: requiredString("Title", { maxlength: 120 }),
    body: requiredString("Message", { maxlength: 5000 }),
    user: ref("User", true),
    answer: flag(0),
    isAnswer: flag(0),
    parent: ref("Ticket"),
    course: ref("Course"),
  },
  { timestamps: true }
);

ticketSchema.index({ user: 1, isAnswer: 1 });
ticketSchema.index({ parent: 1 });

module.exports = model("Ticket", ticketSchema);
module.exports.PRIORITIES = PRIORITIES;
