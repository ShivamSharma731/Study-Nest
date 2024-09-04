const mongoose = require("mongoose");

const otpSchema = mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: "10m" },
});

module.exports = mongoose.model("Otp", otpSchema);
