const express = require("express");
const app = express();
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
const PORT = process.env.PORT || 3500;
const cors = require("cors");
require("dotenv").config();

app.use(cors());

//Connect to databse
connectDB();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const User = require("./model/user.js");
const { json } = require("body-parser");

// POST - create new user
app.post("/login", async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate if user exist in our database
    const user = await User.findOne({ email });
    if (user && user.email === email && user.password === password) {
      console.log("VERIFIED!!!!");
      res.send(user);
    } else {
      console.log("Not Verified");
      res.status(400).send();
    }
  } catch (err) {
    console.log(err);
  }
});
// POST - create new user
app.post("/createuser", (req, res) => {
  try {
    req.body.dateCreated = new Date();
    let data = new User(req.body);
    data.save();
    console.log(data);
    res.send(data);
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
app.delete("/deluser/:email", async (req, res) => {
  try {
    const result = await User.deleteOne({ email: req.params.email });
    res.send(result);
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
