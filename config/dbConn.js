const mongoose = require("mongoose");

const URL =
  "mongodb+srv://jmelias317:Patr1ot12@pick4cluster.3mhfbif.mongodb.net/?retryWrites=true&w=majority";

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
