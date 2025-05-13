// #popclip
// language: javascript
// name: Gemini AI
// identifier: at.rory.GeminiAI
// entitlements: [network]

const axios = require("axios");

async function sendTextToGeminiFlash(apiKey, inputText) {
  const modelName = "gemini-2.0-flash-001";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;

  const headers = {
    "Content-Type": "application/json",
    "x-goog-api-key": apiKey,
  };

  const data = {
    contents: [
      {
        role: "user",
        parts: [{ text: inputText }],
      },
    ],
  };

  try {
    const response = await axios.post(url, data, { headers });
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.error?.message || error.message || "Unknown error";
    console.error("Gemini API call failed:", errorMessage);
    return null;
  }
}

// PopClip entry point
const apiKey = popclip.options.apiKey;
const predefinedPrompt = popclip.options.presetPrompt || "";
const selectedText = popclip.input.text;
const finalPrompt = `${predefinedPrompt} ${selectedText}`.trim();

const response = await sendTextToGeminiFlash(apiKey, finalPrompt);

const reply = response?.candidates?.[0]?.content?.parts?.[0]?.text;

if (reply) {
  popclip.pasteText(reply);
} else {
  popclip.showText("❌ No valid response from Gemini API.");
}
