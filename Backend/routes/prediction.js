const express = require("express");
const router = express.Router();
const ort = require("onnxruntime-node");
const fs = require("fs");

// Load vocab
const vocab = JSON.parse(fs.readFileSync("vocab.json", "utf8"));

// Load ONNX model (do this once globally)
let session;
(async () => {
  session = await ort.InferenceSession.create("simple_rnn_model.onnx");
  console.log("ONNX model loaded!");
})();

// Helper: tokenize and numericalize question (very basic split)
function tokenize(question) {
  // Lowercase
  let text = question.toLowerCase();

  // Remove all characters except letters, numbers, and spaces
  text = text.replace(/[^a-z0-9\s]/g, "");

  // Split by whitespace
  const tokens = text.trim().split(/\s+/);

  return tokens;
}


function textToIndices(tokens, vocab) {
  return tokens.map(t => vocab.indexOf(t) !== -1 ? vocab.indexOf(t) : 0); // 0 = unknown
}

// POST /ask
router.post("/ask", async (req, res) => {
  try {
    if (!session) return res.status(500).send("Model not loaded yet");

    const question = req.body.question;
    if (!question) return res.status(400).send("No question provided");

    // Preprocess: tokenize + numericalize
    const tokens = tokenize(question);
    const indices = textToIndices(tokens, vocab);

    // Create tensor [1, seq_len]
    const inputTensor = new ort.Tensor("int64", BigInt64Array.from(indices.map(BigInt)), [1, indices.length]);

    // Run model
    const results = await session.run({ input: inputTensor });
    const output = results.output.data; // logits

    // Softmax
    const exp = output.map(Math.exp);
    const sumExp = exp.reduce((a, b) => a + b, 0);
    const probs = exp.map(e => e / sumExp);

    // Get max prob and index
    const maxProb = Math.max(...probs);
    const maxIndex = probs.indexOf(maxProb);

    let answer = "I don't know the answer";
    if (maxProb >= 0.5) {
      answer = vocab[maxIndex];
    }

    res.json({ question, answer, confidence: maxProb });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error during prediction");
  }
});

// Export router
module.exports = router;
