const fetch = require('node-fetch');

const API_KEY = 'AIzaSyDaimTSkAOts9mfLS7OD0imVhqlMol5Nr44';
const VERSIONS = ['v1', 'v1beta'];

async function testModels(version) {
  console.log(`\n--- Testing ${version} listModels ---`);
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/${version}/models?key=${API_KEY}`);
    const data = await res.json();
    if (data.models) {
      console.log(`Available models (${version}):`, data.models.map(m => m.name));
    } else {
      console.error(`Error listing models (${version}):`, JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.error(`Fetch error (${version}):`, err.message);
  }
}

async function testChat(version, model) {
  console.log(`\n--- Testing ${version}/${model} generateContent ---`);
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Say "Connection Successful"' }] }]
      })
    });
    const data = await res.json();
    if (data.candidates) {
      console.log(`SUCCESS (${version}/${model}):`, data.candidates[0].content.parts[0].text);
    } else {
      console.error(`FAILURE (${version}/${model}):`, JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.error(`Fetch error (${version}/${model}):`, err.message);
  }
}

async function runTests() {
  await testModels('v1');
  await testModels('v1beta');
  
  // Try common models
  const modelsToTry = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];
  for (const model of modelsToTry) {
     await testChat('v1', model);
     await testChat('v1beta', model);
  }
}

runTests();
