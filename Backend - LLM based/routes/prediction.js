const express = require("express");
const router = express.Router();
const axios = require("axios");

const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY;

// POST /ask
router.post("/ask", async (req, res) => {
  try {
    const question = req.body.question;
    if (!question) return res.status(400).send("No question provided");

   const response = await axios.post(
  "https://api.together.xyz/v1/chat/completions",
  {
    model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
    messages: [
      {
        role: "user",
        content: `Answer the general knowledge question concisely (1–3 words only):\n\nQ: ${question}\nA:`
      }
    ],
    max_tokens: 15,
    temperature: 0.3
  },
  {
    headers: {
      Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
      "Content-Type": "application/json"
    }
  }
);

    const data = response.data;
    console.log("Together API raw response:", data);

    const answer = data.choices?.[0]?.message?.content?.trim() || "I don't know";
    res.json({ question, answer });

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send("Error during prediction");
  }
});


module.exports = router;
