const mongoose = require("mongoose");

const StudyGoalSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, default: "" },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  { timestamps: true }
);

const StudyGoal = mongoose.model("StudyGoal", StudyGoalSchema);
module.exports = StudyGoal;
