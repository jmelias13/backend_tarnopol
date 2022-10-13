const mongoose = require("mongoose");
const counterSchema = mongoose.Schema({
  value: Number,
});

module.exports = mongoose.model("counterSchema", counterSchema);
