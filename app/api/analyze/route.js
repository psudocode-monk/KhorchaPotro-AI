import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { expenses, incomes } = await req.json();

    if ((!expenses || expenses.length === 0) && (!incomes || incomes.length === 0)) {
      return NextResponse.json(
        { message: 'No data provided for analysis' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { message: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Use the latest stable flash model alias found in the available models list
    const modelInstance = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    // Summarize data for prompt
    const expenseSummary = expenses?.map(e => ({
      type: 'Expense',
      date: new Date(e.date).toISOString().split('T')[0],
      category: e.category,
      amount: e.amount,
      note: e.note || ''
    })) || [];

    const incomeSummary = incomes?.map(i => ({
      type: 'Income',
      date: new Date(i.date).toISOString().split('T')[0],
      source: i.source,
      amount: i.amount,
      note: i.note || ''
    })) || [];

    const combinedData = [...expenseSummary, ...incomeSummary].sort((a, b) => new Date(b.date) - new Date(a.date));

    const prompt = `
      Act as a financial advisor. Analyze the following financial records (Expenses and Incomes):
      ${JSON.stringify(combinedData)}

      Provide a concise but insightful analysis in the following markdown format:
      ## 📊 Financial Summary
      (Total Income, Total Expense, Savings Rate, Net Balance)

      ## 🚨 Wasteful Patterns
      (Identify any concerning spending habits)

      ## 💰 Income Analysis
      (Comments on income streams and stability)

      ## 💡 Recommendations
      (Actionable advice to save money and increase wealth)

      Keep the tone professional yet encouraging. Focus on actionable insights.
    `;

    const result = await modelInstance.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ analysis: text }, { status: 200 });
  } catch (error) {
    console.error('AI Analysis Error:', error);
    
    // Check for 429 or quota issues
    if (error.message.includes('429') || error.message.includes('Quota')) {
        return NextResponse.json({ 
            message: 'AI usage limit reached. Please wait a minute and try again.', 
            error: 'Rate Limit Exceeded'
        }, { status: 429 });
    }

    return NextResponse.json({ 
      message: 'Internal Server Error', 
      error: error.message 
    }, { status: 500 });
  }
}
