import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Expense from '@/models/Expense';
import Income from '@/models/Income';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ message: 'Messages are required' }, { status: 400 });
    }

    await connectDB();

    // Fetch user's financial data to provide context
    const [expenses, incomes] = await Promise.all([
      Expense.find({ userId: session.user.id }).sort({ date: -1 }).limit(50),
      Income.find({ userId: session.user.id }).sort({ date: -1 }).limit(50),
    ]);

    const expenseSummary = expenses.map(e => ({
      date: new Date(e.date).toISOString().split('T')[0],
      category: e.category,
      amount: e.amount,
      note: e.note || ''
    }));

    const incomeSummary = incomes.map(i => ({
      date: new Date(i.date).toISOString().split('T')[0],
      source: i.source,
      amount: i.amount,
      note: i.note || ''
    }));

    const systemPrompt = `
      You are an expert strict AI Financial Advisor for the "KhorchaPotro AI" (AI Bangali Tracker) app.
      Your ONLY purpose is to answer questions related to personal finance, budgeting, and the user's specific income and expenses.
      If the user asks a question that is NOT related to finance, politely decline to answer and remind them of your purpose.

      Here is the user's recent financial data context:
      - Recent Expenses: ${JSON.stringify(expenseSummary)}
      - Recent Incomes: ${JSON.stringify(incomeSummary)}

      Provide concise, helpful, and insightful answers. Use Markdown for formatting. Do NOT invent data if it's not in the context.
    `;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ message: 'API key not configured' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
        model: 'gemini-flash-latest',
        systemInstruction: systemPrompt 
    });

    // Gemini requires the initial chat history to start with a 'user' role.
    // The frontend sends an initial greeting mapped as 'model', so we must strip any leading 'model' messages from the history.
    let validMessages = messages.slice(0, -1);
    while (validMessages.length > 0 && validMessages[0].role === 'model') {
        validMessages.shift();
    }
    
    const history = validMessages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
    }));

    const chat = model.startChat({ history });

    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.content);
    const responseText = result.response.text();

    return NextResponse.json({ text: responseText }, { status: 200 });
  } catch (error) {
    console.error('Chat API Error:', error);

    if (error?.message?.includes('429') || error?.message?.includes('Quota')) {
        return NextResponse.json({ 
            message: 'AI usage limit reached. Please wait a minute.', 
        }, { status: 429 });
    }

    return NextResponse.json({ 
      message: 'Internal Server Error', 
      error: error.message 
    }, { status: 500 });
  }
}
