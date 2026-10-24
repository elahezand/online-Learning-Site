const Newsletter = require("../../models/newsletter");

const list = () => Newsletter.find().sort({ _id: -1 }).lean();

module.exports = { list };
