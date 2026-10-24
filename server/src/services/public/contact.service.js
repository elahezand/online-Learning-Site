const Contact = require("../../models/contact");

const create = (input) => Contact.create({ ...input, answer: 0 });

module.exports = { create };
