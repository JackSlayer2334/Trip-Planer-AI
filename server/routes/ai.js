const express = require("express");
const OpenAI = require("openai");
const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/chat", async (req, res) => {
  const { messages } = req.body;
  try {
    const result = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
    });
    res.json({ response: result.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
