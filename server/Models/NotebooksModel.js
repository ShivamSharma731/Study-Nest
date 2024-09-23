const mongoose = require("mongoose");

const notebookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String, // Or an array for multiple notes
      default: "",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users", // Reference to the Users model
      required: true,
    },
  },
  { timestamps: true }
);

const Notebook = mongoose.model("Notebook", notebookSchema);
module.exports = Notebook;
