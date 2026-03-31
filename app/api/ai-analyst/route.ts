import Groq from 'groq-sdk';
import { getConflicts } from '@/lib/conflicts';
import type { ChatMessage } from '@/lib/types';

export const dynamic = 'force-dynamic';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  if (!process.env.GROQ_API_KEY) {
    return new Response(JSON.stringify({ error: 'GROQ_API_KEY not configured' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { message, history = [] }: { message: string; history: ChatMessage[] } = await req.json();

  const conflicts = getConflicts();
  const context = conflicts
    .map((c) => `• ${c.name} (${c.severity}): ${c.status}`)
    .join('\n');

  const systemPrompt = `You are an expert geopolitical intelligence analyst with deep knowledge of global conflicts, international relations, and military strategy. You have access to real-time data on the following active conflicts:

${context}

Provide clear, balanced, fact-based analysis. Cite specific conflicts by name when relevant. Be concise but thorough. Current date: ${new Date().toISOString().slice(0, 10)}.`;

  const messages: Groq.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
    ...history.map((h) => ({
      role: h.role as 'user' | 'assistant',
      content: h.content,
    })),
    { role: 'user', content: message },
  ];

  const stream = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 1024,
    stream: true,
    messages,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content ?? '';
        if (text) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
        }
      }
      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
