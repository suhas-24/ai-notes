import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI (you would set GEMINI_API_KEY in environment variables)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy-key-for-stub');

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required and must be a string' },
        { status: 400 }
      );
    }

    // For now, this is a stub implementation that returns sample blocks
    // In a real implementation, you would:
    // 1. Use the Gemini API to generate content based on the prompt
    // 2. Parse the response and structure it into blocks
    // 3. Return the structured blocks

    // Sample response structure - replace with actual Gemini API call
    const sampleBlocks = [
      {
        type: 'heading',
        content: 'AI-Generated Response',
        metadata: { level: 2 },
      },
      {
        type: 'text',
        content: `Here's a response to your prompt: "${prompt}". This is a placeholder response from the Gemini API stub. In a real implementation, this would be generated content from Google's Gemini AI model.`,
      },
      {
        type: 'list',
        content: '• Key point one about your request\n• Another relevant detail\n• Summary conclusion',
      },
    ];

    // TODO: Uncomment and implement when ready to use actual Gemini API
    /*
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const result = await model.generateContent([
      {
        text: `Convert the following user prompt into structured blocks for a note-taking app. 
        Return a JSON array of blocks where each block has a 'type' (text, heading, list, code, image), 
        'content' (the text content), and optional 'metadata' (like level for headings, language for code).
        
        User prompt: ${prompt}
        
        Please format your response as valid JSON only.`
      }
    ]);
    
    const response = await result.response;
    const text = response.text();
    
    // Parse the AI response and convert to blocks
    try {
      const blocks = JSON.parse(text);
      return NextResponse.json({ blocks });
    } catch (parseError) {
      // Fallback if AI doesn't return valid JSON
      const fallbackBlocks = [{
        type: 'text',
        content: text,
      }];
      return NextResponse.json({ blocks: fallbackBlocks });
    }
    */

    return NextResponse.json({ 
      blocks: sampleBlocks,
      message: 'This is a stub response. Set GEMINI_API_KEY to enable real AI generation.' 
    });

  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate content',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
