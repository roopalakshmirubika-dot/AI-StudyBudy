const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const askGemini = async (prompt) => {
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    if (prompt.includes("flashcards")) {
      return JSON.stringify([
        { "question": "What is the process used by plants to harness energy?", "answer": "Photosynthesis" },
        { "question": "What is converted into chemical energy?", "answer": "Sunlight" }
      ]);
    }
    return "This is a mock response because the Gemini API key is invalid or unauthorized.";
  }
};

module.exports = { askGemini };
