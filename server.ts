import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Google GenAI client
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. Parse Order API using Gemini
app.post('/api/gemini/parse-order', async (req: Request, res: Response) => {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  // Fallback defaults in case API key is missing or model is unavailable
  const fallbackMatcha = {
    name: 'Ceremonial Matcha',
    origin: 'Single-origin Uji, Kyoto harvest',
    totalPrice: '$7.75',
    prepTime: '~3 min prep',
    aiResponse:
      "Pure calm in a glass. I've crafted your ceremonial Uji matcha with steamed-then-chilled Califia oat milk and delicately infused a half-pump of house lavender syrup.",
    components: [
      { label: 'Base', detail: 'Ceremonial Grade Matcha', price: '$6.50', icon: 'local_cafe' },
      { label: 'Temp & Ice', detail: 'Iced 🧊 (Light Ice)', price: 'Included', icon: 'ac_unit' },
      { label: 'Milk', detail: 'Oat Milk (Califia Farms)', price: '+$0.75', icon: 'water_drop' },
      { label: 'Sweetness', detail: '1 pump House Lavender', price: '+$0.50', icon: 'spa' },
    ],
    pairing: {
      name: 'Yuzu Pistachio Croissant',
      price: '$4.50',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBw1XUb_hMC66-Lj06EU0mwbWmjSozV_O0no-eL7rHHe8rmp6kuGZFVIWyQRO15JkQqZJvYE6Fto0ZcbrrTtb1IWr3cZvAh-MQYO_5uP-BIHku-X3i4d5Y3R3Bl1cWSm6B2K-tmKJrHbjB5MNsToY7uPhFVmPFVmt99ban_ezuEQ-5jJt7dV53on9GhoerJccCIKzzsSGp0uJdRSJFag4gkcbsolUxpMhXr0CHPngZRDSOILesuljc_',
    },
  };

  if (!ai) {
    return res.json(fallbackMatcha);
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `You are the master barista AI at "Craft & Bloom" artisan coffee bar. A customer ordered: "${prompt}".
Extract the drink specifications and respond strictly in valid JSON with this format:
{
  "name": "string (e.g. Ceremonial Matcha, Flat White, etc.)",
  "origin": "string (e.g. Single-origin Uji, Kyoto harvest or Ethiopian Guji)",
  "totalPrice": "string (e.g. $7.75)",
  "prepTime": "string (e.g. ~3 min prep)",
  "aiResponse": "poetic, evocative, warm 2-sentence barista confirmation describing how it's crafted",
  "components": [
    {"label": "Base", "detail": "string", "price": "$X.XX", "icon": "local_cafe"},
    {"label": "Temp & Ice", "detail": "string", "price": "Included or +$X.XX", "icon": "ac_unit"},
    {"label": "Milk", "detail": "string", "price": "Included or +$X.XX", "icon": "water_drop"},
    {"label": "Sweetness", "detail": "string", "price": "Included or +$X.XX", "icon": "spa"}
  ],
  "pairing": {
    "name": "string pastry suggestion",
    "price": "$4.50",
    "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuBw1XUb_hMC66-Lj06EU0mwbWmjSozV_O0no-eL7rHHe8rmp6kuGZFVIWyQRO15JkQqZJvYE6Fto0ZcbrrTtb1IWr3cZvAh-MQYO_5uP-BIHku-X3i4d5Y3R3Bl1cWSm6B2K-tmKJrHbjB5MNsToY7uPhFVmPFVmt99ban_ezuEQ-5jJt7dV53on9GhoerJccCIKzzsSGp0uJdRSJFag4gkcbsolUxpMhXr0CHPngZRDSOILesuljc_"
  }
}`,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err) {
    console.error('Error generating order parse:', err);
    return res.json(fallbackMatcha);
  }
});

// 2. Mystery Roulette Generator
app.post('/api/gemini/roulette', async (_req: Request, res: Response) => {
  const defaultPicks = [
    { name: 'Yuzu Cold Drip Tonic', vibe: 'Midday Focus • Crisp Citrus Finish', price: '$6.50' },
    { name: 'Smoked Vanilla Nitro', vibe: 'Afternoon Chill • Creamy Oak Notes', price: '$6.85' },
    { name: 'Cascara Blood Orange Fizz', vibe: 'Sparkling Lift • Low Caffeine & Tangy', price: '$5.95' },
    { name: 'Cortado w/ Hazelnut Cloud', vibe: 'Quick Espresso Kick • Nutty Velvet', price: '$5.45' },
    { name: 'Cardamom Shakerato', vibe: 'Botanical Crisp • Double Shot Chilled', price: '$6.25' },
    { name: 'Pistachio Gesha Pour-over', vibe: 'Floral Clarity • Jasmine & Honey', price: '$7.50' },
  ];

  if (!ai) {
    const randomPick = defaultPicks[Math.floor(Math.random() * defaultPicks.length)];
    return res.json(randomPick);
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Generate one artisan mystery signature drink for Craft & Bloom coffee bar. Return strictly JSON:
{
  "name": "string",
  "vibe": "string (e.g. Midday Focus • Crisp Citrus Finish)",
  "price": "string (e.g. $6.50)"
}`,
      config: {
        responseMimeType: 'application/json',
      },
    });
    const result = JSON.parse(response.text || '{}');
    return res.json(result);
  } catch (err) {
    console.error('Error in roulette:', err);
    const randomPick = defaultPicks[Math.floor(Math.random() * defaultPicks.length)];
    return res.json(randomPick);
  }
});

// 3. Social Icebreaker Generator
app.post('/api/gemini/icebreaker', async (req: Request, res: Response) => {
  const { tags } = req.body;
  const tagList = Array.isArray(tags) ? tags.join(', ') : '#SciFi, #GenerativeDesign';

  if (!ai) {
    return res.json({
      icebreaker: '“Have you tried pairing the cold brew with chapter 4 yet? It sets the pace perfectly.”',
      affinity: 'High Affinity',
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Generate an insightful, subtle, cafe-friendly one-sentence icebreaker between two patrons who share these interests: ${tagList}.
Return strictly JSON: { "icebreaker": "string in quotes", "affinity": "High Affinity" }`,
      config: {
        responseMimeType: 'application/json',
      },
    });
    return res.json(JSON.parse(response.text || '{}'));
  } catch (err) {
    return res.json({
      icebreaker: '“Have you tried pairing the cold brew with chapter 4 yet? It sets the pace perfectly.”',
      affinity: 'High Affinity',
    });
  }
});

// Setup Vite dev server or serve static
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true, port: 3000, host: '0.0.0.0' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Craft & Bloom server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
