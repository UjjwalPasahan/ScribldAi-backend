const express = require('express');
const router = express.Router();
const sharp = require('sharp');  // To handle image processing
const base64 = require('base64-js');  // For base64 decoding
const analyzeImage = require('./utils.js'); 

router.post('/', async (req, res) => {
  try {
    console.log('Received request body:', JSON.stringify(req.body, null, 2));
    
    const { image, dictOfVars } = req.body;
    
    if (!image) {
      throw new Error('No image data provided');
    }
    
    console.log('Calling analyzeImage function');
    const results = await analyzeImage(image, dictOfVars);
    console.log('Results from analyzeImage:', JSON.stringify(results, null, 2));
    
    if (results === undefined) {
      throw new Error('analyzeImage returned undefined');
    }
    
    const resultsArray = Array.isArray(results) ? results : [results];
    console.log('ResultsArray:', JSON.stringify(resultsArray, null, 2));
    
    const processedResults = resultsArray.map(result => {
      // Your processing logic here
      return result; // or whatever processing you need to do
    });
    
    console.log('Processed results:', JSON.stringify(processedResults, null, 2));
    
    res.json(processedResults);
  } catch (error) {
    console.error('Error in /analyze route:', error);
    res.status(500).json({ error: `Error processing image: ${error.message}` });
  }
});

module.exports = router;
