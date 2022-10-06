const mongoose = require("mongoose");
const { collection } = require("../model/user");

const URL =
  "mongodb+srv://jmelias13:admin@testtarnopol.ipp4ztg.mongodb.net/tarnopolFootball?retryWrites=true&w=majority";

const connectDB = async () => {
  try {
    await mongoose.connect(URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectDB;
