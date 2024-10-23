require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/calculate', async (req, res) => {
  try {
    const { image, dictOfVars } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    Analyze the handwritten mathematical expression in the image.
    Follow these steps strictly:

    1. Identify the expression: Carefully read the handwritten numbers and symbols.
    2. Solve the expression: Use standard mathematical rules (PEMDAS if applicable).
    3. Format the response: Return ONLY a single JSON object in this exact format:

    [{"expr": "EXACT_EXPRESSION_FROM_IMAGE", "result": CALCULATED_RESULT}]

    Example:
    If the image shows "3 + 4", your entire response should be:
    [{"expr": "3 + 4", "result": 7}]

    Important:
    - Do not include any explanation, commentary, or additional text.
    - Ensure the "expr" value exactly matches what's written in the image.
    - The "result" should be the numerical answer only.
    - Use double quotes for strings and no quotes for numbers.
    - Do not use backticks, markdown, or any other formatting.

    Now, analyze the image and provide only the JSON response as specified.
    `;

    const result = await model.generateContent([prompt, { inlineData: { data: image, mimeType: 'image/png' } }]);
    const response = await result.response;
    const text = response.text();

    console.log('Raw AI response:', text);

    try {
      const parsedData = JSON.parse(text);
      res.json(parsedData);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      res.status(500).json({ error: 'Failed to parse AI response' });
    }
  } catch (error) {
    console.error('Error in /calculate route:', error);
    res.status(500).json({ error: `Error processing image: ${error.message}` });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});