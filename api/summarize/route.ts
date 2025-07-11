import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { content, type = 'summarize' } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    let prompt;
    switch (type) {
      case 'summarize':
        prompt = `Please provide a concise summary of the following content:\n\n${content}`;
        break;
      case 'explain':
        prompt = `Please explain the following content in simple terms:\n\n${content}`;
        break;
      case 'outline':
        prompt = `Please create an outline of the following content:\n\n${content}`;
        break;
      default:
        prompt = `Please summarize the following content:\n\n${content}`;
    }

    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error generating summary:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}
