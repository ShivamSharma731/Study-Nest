const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  username: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const channelSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  messages: [messageSchema],
});

const Channel = mongoose.model("Channel", channelSchema);

module.exports = Channel;
