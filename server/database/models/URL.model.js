const mongoose = require("mongoose");

const URLSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  originalURL: { type: String, required: true },
  creationDate: { type: Date, default: Date.now },
  expirationDate: { type: Date },
  _userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
});

const URL = mongoose.model("URL", URLSchema);

module.exports = URL;
