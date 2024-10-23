
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GEMINI_API_KEY } = require('../../constants.js');
const axios = require('axios');
const fs = require('fs');

async function analyzeImage(image, dictOfVars) {
    try {

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
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
      const result = await model.generateContent([prompt, image]);
      const response = await result.response;
      const text = await response.text();

      
  
      console.log('Raw AI response:', text);
  
      // Parse the response
      try {
        const parsedData = JSON.parse(text);
        console.log('Parsed data:', parsedData);
        return parsedData; // This should already be in the correct format
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError);
        return [{ error: 'Failed to parse AI response' }];
      }
    } catch (error) {
      console.error('Error in analyzeImage:', error);
      return [{ error: error.message }];
    }
  }
  

  module.exports = analyzeImage;