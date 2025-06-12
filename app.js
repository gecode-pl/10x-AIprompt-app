const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public")); // ← TU JEST KLUCZ

const authRoutes = require("./routes/auth");
const promptRoutes = require("./routes/prompts");

app.use("/api/auth", authRoutes);
app.use("/api/prompts", promptRoutes);

const Prompt = require("./models/Prompt");

app.get("/public/:uuid", async (req, res) => {
  const { uuid } = req.params;
  const prompts = await Prompt.find({ userId: uuid }).sort("position");
  res.json({ userId: uuid, prompts });
});

// publiczne API do pobierania promptów w formacie JSON
app.get("/api/prompts/json", async (req, res) => {
  try {
    const prompts = await Prompt.find().sort("position");
    const formattedPrompts = prompts.map(prompt => ({
      category: prompt.category || "Uncategorized",
      name: prompt.name,
      prompt: prompt.content
    }));
    res.json(formattedPrompts);
  } catch (error) {
    console.error('Error getting prompts in JSON format:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = app;
