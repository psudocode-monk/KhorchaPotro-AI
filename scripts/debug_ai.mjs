import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
let apiKey = process.env.GEMINI_API_KEY;

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
  console.error('❌ GEMINI_API_KEY is missing in .env.local');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
  console.log('🔑 API Key found (ends with):', apiKey.slice(-4));
  
  try {
    console.log('Testing generateContent with gemini-1.5-flash...');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent('Hello');
    console.log('✅ gemini-1.5-flash is working!');
    console.log('Response:', result.response.text());
  } catch (error) {
    console.error('❌ gemini-1.5-flash failed:', error.message);
    
    try {
        console.log('Testing generateContent with gemini-pro...');
        const model2 = genAI.getGenerativeModel({ model: 'gemini-pro' });
        await model2.generateContent('Hello');
        console.log('✅ gemini-pro is working!');
    } catch (e) {
        console.error('❌ gemini-pro failed:', e.message);
    }
  }
}

listModels();
