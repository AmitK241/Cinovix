import Groq from 'groq-sdk';

// ── Groq Model Configuration ──────────────────────────────────────────────────
// Active supported model list: https://console.groq.com/docs/models
// Deprecations / Status: https://console.groq.com/docs/deprecations
//
// Recommended Models:
// - 'openai/gpt-oss-120b' (Default): Higher quality reasoning & precise structured JSON
// - 'openai/gpt-oss-20b': Faster token generation / lower latency
const GROQ_MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';

let _groq = null;
const getGroq = () => {
  if (!_groq) {
    if (!process.env.GROQ_API_KEY) {
      console.warn('⚠️ [Groq AI] process.env.GROQ_API_KEY is not defined in environment variables.');
    }
    _groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return _groq;
};

// Safe JSON extractor that strips <think> tags, markdown fences, and parses safely
const extractJsonObject = (rawText) => {
  if (!rawText) return null;
  // Remove reasoning tokens if present
  let cleaned = rawText.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  // Remove markdown code fences
  cleaned = cleaned.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    // Fallback regex to locate the first {...} block
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw new Error('Failed to parse JSON response from Groq');
  }
};

// Analyze user's watch history + My List to extract preference profile
export const analyzeUserTaste = async (titles) => {
  const prompt = `You are a movie recommendation assistant. Based on this list of movies/shows a user has watched or saved: ${titles.join(', ')}.

Analyze their taste and return ONLY a valid JSON object (no markdown, no reasoning, no extra text) with this exact structure:
{
  "genres": ["genre1", "genre2"],
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "mood": "one word describing overall mood preference",
  "reasoning": "one sentence explaining the taste pattern"
}`;

  try {
    const completion = await getGroq().chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: GROQ_MODEL,
      temperature: 0.3,
      response_format: { type: 'json_object' },
      include_reasoning: false,
    });

    const raw = completion.choices[0]?.message?.content || '';
    return extractJsonObject(raw);
  } catch (error) {
    console.error(
      `❌ [Groq AI Error] Model (${GROQ_MODEL}) failed in analyzeUserTaste:`,
      error.message
    );
    console.error('ℹ️ Check https://console.groq.com/docs/models or https://console.groq.com/docs/deprecations for live model status.');

    // Graceful fallback to avoid breaking recommendation feed
    return {
      genres: ['Action', 'Drama'],
      keywords: ['popular', 'trending', 'movies'],
      mood: 'entertaining',
      reasoning: 'Curated recommendations based on top trending cinema',
    };
  }
};

// Convert natural language search query into structured TMDB filters
export const parseSearchQuery = async (query) => {
  const prompt = `You are a movie search assistant. Convert this natural language movie request into TMDB-compatible search parameters.

User query: "${query}"

Return ONLY a valid JSON object (no markdown, no reasoning, no extra text) with this exact structure:
{
  "keywords": "short search string of 2-4 words capturing the core request",
  "genres": ["genre1", "genre2"],
  "mood": "one word mood",
  "language": "ISO 639-1 code if a specific film industry/language is mentioned (e.g. 'hi' for Bollywood/Hindi, 'te' for Telugu, 'ta' for Tamil, 'ko' for Korean, 'en' for Hollywood/English), otherwise null"
}`;

  try {
    const completion = await getGroq().chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: GROQ_MODEL,
      temperature: 0.3,
      response_format: { type: 'json_object' },
      include_reasoning: false,
    });

    const raw = completion.choices[0]?.message?.content || '';
    return extractJsonObject(raw);
  } catch (error) {
    console.error(
      `❌ [Groq AI Error] Model (${GROQ_MODEL}) failed in parseSearchQuery:`,
      error.message
    );
    console.error('ℹ️ Check https://console.groq.com/docs/models or https://console.groq.com/docs/deprecations for live model status.');

    // Graceful fallback so search still functions using standard text search
    return {
      keywords: query,
      genres: [],
      mood: 'general',
      language: null,
    };
  }
};