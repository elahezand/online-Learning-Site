const mongoose = require("mongoose");

const withTransaction = (fn) => mongoose.connection.transaction(fn);

module.exports = withTransaction;