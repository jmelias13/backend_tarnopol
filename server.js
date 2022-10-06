const express = require("express");
const app = express();
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");

//Connect to databse
connectDB();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const User = require("./model/user.js");
app.post("/createuser", async (req, res) => {
  try {
    req.body.dateCreated = new Date();
    let data = new User(req.body);
    const result = await data.save();
    res.send(result);
  } catch (err) {
    console.log(err);
  }
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(3500, () => {
    console.log("Server listening on 3500");
  });
});
