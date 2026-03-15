import fs from 'fs';
import path from 'path';
import https from 'https';

// Load API Key
const envPath = path.resolve(process.cwd(), '.env.local');
let apiKey = '';

if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  for (const line of envConfig.split('\n')) {
    const [key, value] = line.split('=');
    if (key && value && key.trim() === 'GEMINI_API_KEY') {
      apiKey = value.trim();
      break;
    }
  }
}

if (!apiKey) {
  console.error('❌ GEMINI_API_KEY not found');
  process.exit(1);
}

// Slice carefully to avoid error if key is short
const start = apiKey.slice(0, 5);
const end = apiKey.length > 5 ? apiKey.slice(-4) : '';
console.log(`🔑 Checking key: ${start}...${end}`);

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    if (res.statusCode === 200) {
      const response = JSON.parse(data);
      console.log('✅ API Request Successful');
      if (response.models) {
        console.log('Available Models:');
        response.models.forEach(m => console.log(`- ${m.name}`));
      } else {
        console.log('No models returned in list.');
        console.log(JSON.stringify(response, null, 2));
      }
    } else {
      console.error(`❌ API Request Failed: ${res.statusCode}`);
      try {
        const error = JSON.parse(data);
        console.error('Error Details:', JSON.stringify(error, null, 2));
      } catch (e) {
        console.error('Raw Response:', data);
      }
    }
  });
}).on('error', (e) => {
  console.error('❌ Network Error:', e.message);
});
