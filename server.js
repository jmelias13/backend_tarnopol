const express = require("express");
const app = express();
const https = require("https");
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

const counter = require("./model/counter.js");
app.get("/getcounter", async (req, res) => {
  try {
    let id = "63477166bd3019e77ab310f3";
    let results = await counter.findByIdAndUpdate(id, { $inc: { value: 1 } });
    console.log("Counter Increased to " + results.value);
    res.send(results);
  } catch (err) {
    console.log(err);
  }
});

const User = require("./model/user.js");
const Weekly_Game_Schedule = require("./model/schedule.js");

// POST - create new user
app.post("/login", async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate if user exist in our database
    const user = await User.findOne({ email });
    if (user && user.email === email && user.password === password) {
      res.send(user);
    } else {
      res.status(400).send();
    }
  } catch (err) {
    console.log(err);
  }
});
// POST - create new user
app.post("/createuser", (req, res) => {
  try {
    let today = new Date();
    req.body.dateCreated =
      today.getMonth() + 1 + "-" + today.getDate() + "-" + today.getFullYear();
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

// GET - get all users
app.get("/getweeklygameschedule", async (req, res) => {
  try {
    Weekly_Game_Schedule.findOne()
      .sort({ _id: -1 })
      .limit(1)
      .then((result) => {
        if (result && result.active === true) {
          console.log("Already Added");
          return res.send(result);
        } else {
          https
            .get(
              "https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds?apiKey=d4904aa7f2f316605ce839308d91e4ba&regions=us&markets=spreads&bookmakers=draftkings",
              (resp) => {
                let data = "";
                // Concatinate each chunk of data
                resp.on("data", (chunk) => {
                  data += chunk;
                });

                // Once the response has finished, do something with the result
                resp.on("end", () => {
                  let jsonData = JSON.parse(data);
                  let newSchedule = new Weekly_Game_Schedule();
                  console.log(jsonData);
                  jsonData.forEach((game) => {
                    let gameObj = {
                      commence_time: game.commence_time,
                      home_team: game.home_team,
                      away_team: game.away_team,
                      lastUpdatedOdds: game.bookmakers[0].last_update,
                    };
                    if (
                      game.bookmakers[0].markets[0].outcomes[0].name ===
                      gameObj.home_team
                    ) {
                      gameObj.home_team_11adjusted_spread =
                        game.bookmakers[0].markets[0].outcomes[0].point + 11;
                      gameObj.away_team_11adjusted_spread =
                        game.bookmakers[0].markets[0].outcomes[1].point + 11;
                    } else {
                      gameObj.home_team_11adjusted_spread =
                        game.bookmakers[0].markets[0].outcomes[1].point + 11;
                      gameObj.away_team_11adjusted_spread =
                        game.bookmakers[0].markets[0].outcomes[0].point + 11;
                    }
                    newSchedule.games.push(gameObj);
                  });
                  let today = new Date();
                  newSchedule.datePulled =
                    today.getMonth() +
                    1 +
                    "-" +
                    today.getDate() +
                    "-" +
                    today.getFullYear();
                  newSchedule.save();
                  res.json(newSchedule);
                });
                // If an error occured, return the error to the user
              }
            )
            .on("error", (err) => {
              res.json("Error: " + err.message);
            });
        }
      })
      .catch((err) => console.log(err));
  } catch (err) {
    console.error(err);
    res.send(err);
  }
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
  });
});
