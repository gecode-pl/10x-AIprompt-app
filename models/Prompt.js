const mongoose = require("mongoose");

const promptSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  content: { type: String, required: true },
  position: { type: Number, default: 0 },
});

module.exports = mongoose.model("Prompt", promptSchema);
