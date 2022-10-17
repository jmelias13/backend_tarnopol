const mongoose = require("mongoose");
const weeklyScheduleSchema = mongoose.Schema({
  games: [
    {
      commence_time: Date,
      home_team: String,
      away_team: String,
      home_team_11adjusted_spread: Number,
      away_team_11adjusted_spread: Number,
      home_team_score: Number,
      away_team_score: Number,
    },
  ],
  datePulled: {
    type: String,
    required: true,
  },
  active: { type: Boolean, default: true },
});

module.exports = mongoose.model("Weekly_Game_Schedule", weeklyScheduleSchema);
