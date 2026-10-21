const mongoose = require("mongoose");
const newsLetterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);



const newsletterModel = mongoose.model("NewsLetter", newsLetterSchema);

module.exports = newsletterModel;
