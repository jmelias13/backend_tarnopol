const express = require("express");
const app = express();
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
const PORT = process.env.PORT || 3500;
const cors = require("cors");
app.use(cors());

app.get("/login", (req, res) => {
  res.send({
    token: "test123",
  });
});

//Connect to databse
connectDB();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const User = require("./model/user.js");

// POST - create new user
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

// GET - get all users
app.get("/getuserlist", async (req, res) => {
  try {
    const userList = await User.find();
    console.log(userList);
    res.send(userList);
  } catch (err) {
    console.log(err);
  }
});

// DEL - delete a single user
app.delete("/deluser/:username", async (req, res) => {
  try {
    const result = await User.deleteOne({ username: req.params.username });
    console.log(result);
    res.send("User Deleted: " + req.params.username);
  } catch (err) {
    console.log(err);
  }
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
  });
});
