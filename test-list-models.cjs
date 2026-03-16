// List available models for this API key
const https = require('https');

const GEMINI_API_KEY = 'AIzaSyD0K0yeZSmHNgeaUftBHEdU7pPKI9dRY2I';

console.log('Listing available Gemini models...\n');

const options = {
  hostname: 'generativelanguage.googleapis.com',
  path: `/v1/models?key=${GEMINI_API_KEY}`,
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = https.request(options, (res) => {
  let response = '';
  res.on('data', (chunk) => response += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(response);
      console.log('Status:', res.statusCode);
      
      if (res.statusCode === 200) {
        console.log('\n✓ Available models:');
        if (parsed.models) {
          parsed.models.forEach(model => {
            console.log(`  - ${model.name}`);
          });
        }
      } else {
        console.log('Error:', JSON.stringify(parsed, null, 2));
      }
    } catch (e) {
      console.log('Parse error:', e.message);
      console.log('Raw response:', response);
    }
  });
});

req.on('error', (e) => console.error('Request error:', e.message));
req.end();

