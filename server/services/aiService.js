import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Analyze user's watch history + My List to extract preference profile
export const analyzeUserTaste = async (titles) => {
  const prompt = `You are a movie recommendation assistant. Based on this list of movies/shows a user has watched or saved: ${titles.join(', ')}.

Analyze their taste and return ONLY a JSON object (no markdown, no explanation) with this exact structure:
{
  "genres": ["genre1", "genre2"],
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "mood": "one word describing overall mood preference",
  "reasoning": "one sentence explaining the taste pattern"
}`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'openai/gpt-oss-120b',
    temperature: 0.3,
  });

  const raw = completion.choices[0].message.content;
  const cleaned = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
};

// Convert natural language search query into structured TMDB filters
export const parseSearchQuery = async (query) => {
  const prompt = `You are a movie search assistant. Convert this natural language movie request into TMDB-compatible search parameters.

User query: "${query}"

Return ONLY a JSON object (no markdown, no explanation) with this exact structure:
{
  "keywords": "short search string of 2-4 words capturing the core request",
  "genres": ["genre1", "genre2"],
  "mood": "one word mood",
  "language": "ISO 639-1 code if a specific film industry/language is mentioned (e.g. 'hi' for Bollywood/Hindi, 'te' for Telugu, 'ta' for Tamil, 'ko' for Korean, 'en' for Hollywood/English), otherwise null"
}`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'openai/gpt-oss-120b',
    temperature: 0.3,
  });

  const raw = completion.choices[0].message.content;
  const cleaned = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
};