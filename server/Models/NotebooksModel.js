const mongoose = require("mongoose");

const notebookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String, 
      default: "",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  { timestamps: true }
);

const Notebook = mongoose.model("Notebook", notebookSchema);
module.exports = Notebook;
