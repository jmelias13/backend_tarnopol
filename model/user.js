const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, required: true },
  dateCreated: { type: String, required: true },
});

module.exports = mongoose.model("users", userSchema);
