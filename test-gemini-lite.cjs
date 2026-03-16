// Test gemini-2.0-flash-lite model
const https = require('https');

const GEMINI_API_KEY = 'AIzaSyD0K0yeZSmHNgeaUftBHEdU7pPKI9dRY2I';

console.log('Testing gemini-2.0-flash-lite model...\n');

const testGemini = (model) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      contents: [{ parts: [{ text: 'Say "Hello" in one word' }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 100
      }
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let response = '';
      res.on('data', (chunk) => response += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(response);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: response });
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(data);
    req.end();
  });
};

async function main() {
  // Test gemini-2.0-flash-lite (most quota-friendly)
  console.log('Testing: gemini-2.0-flash-lite');
  const result = await testGemini('gemini-2.0-flash-lite');
  console.log(`Status: ${result.status}`);
  
  if (result.status === 200) {
    console.log('✓ SUCCESS! gemini-2.0-flash-lite is working!');
    console.log('Response:', JSON.stringify(result.data, null, 2).substring(0, 300));
  } else {
    console.log('✗ Failed');
    console.log('Error:', JSON.stringify(result.data || result.raw, null, 2).substring(0, 500));
  }
}

main();

