import { GoogleGenAI, ApiError } from '@google/genai';
import { destinations } from '../../src/data/destinations.ts';
import { services } from '../../src/data/services.ts';

export const config = {
  rateLimit: {
    windowLimit: 20,
    windowSize: 60,
    aggregateBy: ['ip', 'domain'],
  },
};

const ALLOWED_ORIGINS = new Set(['https://ranomoedu.com', 'http://localhost:4321']);
if (process.env.DEPLOY_URL) ALLOWED_ORIGINS.add(process.env.DEPLOY_URL);

const destinationSummary = destinations
  .map(
    (d) =>
      `${d.name}: Tuition ${d.avgTuitionRange}, Living ${d.avgLivingCost}, Entry: ${d.entryRequirements}, Intakes: ${d.intakes.join(', ')}, Top universities: ${d.topUniversities.slice(0, 3).join(', ')}`
  )
  .join('\n');

const servicesSummary = services
  .map((s) => `${s.title}: ${s.shortDesc}`)
  .join('\n');

const systemInstruction = `You are RanamoBot, the AI study-abroad counselor for Ranamo Edu. You help students explore studying abroad with friendly, concise, and accurate answers.

DESTINATIONS WE COVER (7 countries):
${destinationSummary}

OUR SERVICES:
${servicesSummary}

GENERAL TOPICS YOU CAN HELP WITH:
- English proficiency tests: IELTS, TOEFL, PTE (and score requirements per country)
- Graduate admission tests: GRE, GMAT
- Statement of Purpose (SOP) and Letter of Recommendation (LOR) writing tips
- Financial documentation and proof of funds
- PR/immigration pathways after graduation

CONTACT:
- WhatsApp: +91 73890 27489
- Website contact page: /contact

GUARDRAILS:
- Never fabricate specific admission statistics, visa approval rates, or fees beyond the ranges provided above
- For personal profile evaluation questions (e.g. "Will I get into X university?"), encourage the student to book a free consultation
- Respond in plain text only — no markdown, bullet points with dashes, or asterisks, as your replies appear in a chat UI
- Keep responses concise and conversational
- Tone: warm, helpful, encouraging`;

function corsHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Vary: 'Origin',
  };
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS';
    headers['Access-Control-Allow-Headers'] = 'Content-Type';
  }
  return headers;
}

export default async (req: Request): Promise<Response> => {
  const origin = req.headers.get('Origin');
  const headers = corsHeaders(origin);

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers });
  }

  const { messages } = body as { messages?: unknown };

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: 'messages must be a non-empty array' }), {
      status: 400,
      headers,
    });
  }

  for (const msg of messages) {
    const m = msg as { role?: unknown; content?: unknown };
    if (m.role !== 'user' && m.role !== 'assistant') {
      return new Response(
        JSON.stringify({ error: 'Each message must have role "user" or "assistant"' }),
        { status: 400, headers }
      );
    }
    if (typeof m.content !== 'string' || m.content.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Each message must have non-empty content' }), {
        status: 400,
        headers,
      });
    }
  }

  const trimmed = (messages as Array<{ role: string; content: string }>).slice(-40);

  const contents = trimmed.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: { systemInstruction },
    });

    const reply = result.text ?? '';
    if (!reply) {
      return new Response(
        JSON.stringify({
          error: "I'm having trouble connecting right now. Please reach us on WhatsApp or book a consultation using the buttons below.",
        }),
        { status: 500, headers }
      );
    }

    return new Response(JSON.stringify({ reply }), { status: 200, headers });
  } catch (err) {
    if (err instanceof ApiError && err.status === 429) {
      return new Response(
        JSON.stringify({
          error: "I'm getting too many requests right now. Please try again in a moment, or reach us on WhatsApp.",
        }),
        { status: 429, headers }
      );
    }
    return new Response(
      JSON.stringify({
        error: "I'm having trouble connecting right now. Please reach us on WhatsApp or book a consultation using the buttons below.",
      }),
      { status: 500, headers }
    );
  }
};
