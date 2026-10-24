const Department = require("../../models/department");
const DepartmentSub = require("../../models/department-sub");

const listDepartments = () => Department.find().sort({ _id: 1 }).lean();

const listDepartmentSubs = (departmentId) => DepartmentSub.find({ parent: departmentId }).sort({ _id: 1 }).lean();

module.exports = { listDepartments, listDepartmentSubs };
