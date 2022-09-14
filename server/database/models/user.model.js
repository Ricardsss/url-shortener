const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  creationDate: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
  hashedPassword: { type: String, required: true },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
