const express = require("express");
const Prompt = require("../models/Prompt");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

// CREATE
router.post("/", auth, async (req, res) => {
  try {
    console.log('Headers:', req.headers); // Debug log
    console.log('User from request:', req.user); // Debug log
    console.log('Request body:', req.body); // Debug log
    
    const { name, category, content } = req.body;
    console.log('Creating prompt with data:', { name, category, content, userId: req.user.userId }); // Debug log
    
    const prompt = await Prompt.create({
      userId: req.user.userId, // Zmiana z req.user.id na req.user.userId
      name,
      category,
      content,
      position: Date.now(),
    });
    
    console.log('Created prompt:', prompt); // Debug log
    res.status(201).json(prompt);
  } catch (error) {
    console.error('Error creating prompt:', error); // Debug log
    res.status(500).json({ message: error.message });
  }
});

// READ
router.get("/", auth, async (req, res) => {
  const prompts = await Prompt.find({ userId: req.user.userId }).sort("position");
  res.json(prompts);
});

// UPDATE
router.put("/:id", auth, async (req, res) => {
  try {
    console.log('Update request for prompt:', req.params.id);
    console.log('User ID:', req.user.userId);
    console.log('Update data:', req.body);
    
    const prompt = await Prompt.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    );
    
    if (!prompt) {
      return res.status(404).json({ message: "Prompt not found" });
    }
    
    res.json(prompt);
  } catch (error) {
    console.error('Error updating prompt:', error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE
router.delete("/:id", auth, async (req, res) => {
  try {
    console.log('Delete request for prompt:', req.params.id);
    console.log('User ID:', req.user.userId);
    
    const result = await Prompt.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    
    if (!result) {
      return res.status(404).json({ message: "Prompt not found" });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting prompt:', error);
    res.status(500).json({ message: error.message });
  }
});

// REORDER
router.patch("/reorder", auth, async (req, res) => {
  const { reorderedIds } = req.body; // np. [promptId1, promptId2, ...]
  for (let i = 0; i < reorderedIds.length; i++) {
    await Prompt.updateOne(
      { _id: reorderedIds[i], userId: req.user.id },
      { position: i }
    );
  }
  res.json({ message: "Order updated" });
});

// GET prompts in JSON format
router.get("/json", async (req, res) => {
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

module.exports = router;
