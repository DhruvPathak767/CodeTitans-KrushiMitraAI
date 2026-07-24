import { Groq } from 'groq-sdk';
import logger from '../../config/logger.js';
import ChatMessage from '../../models/ChatMessage.js';
import Farm from '../../models/Farm.js';
import weatherService from '../weather/weather.service.js';
import advisoryService from '../advisory/advisory.service.js';
import { getLanguageName } from '../../utils/i18n.util.js';

class ChatService {
  constructor() {
    this.apiKey = process.env.GROQ_API_KEY;
    if (this.apiKey) {
      this.groq = new Groq({ apiKey: this.apiKey });
    }
  }

  /**
   * Resolve user's active farm and gather full context (Farm, Weather, Groq Advisory)
   */
  async getFullContext(user, lang = 'en') {
    let farm = null;
    if (user.activeFarm) {
      farm = await Farm.findById(user.activeFarm).lean();
    }
    if (!farm) {
      farm = await Farm.findOne({ userId: user._id, status: 'ACTIVE' }).lean();
    }

    let weather = null;
    let advisory = null;

    if (farm) {
      try {
        weather = await weatherService.getWeatherForActiveFarm(user, lang);
      } catch (e) {
        logger.warn(`Chat Context Weather Fetch Failed: ${e.message}`);
      }

      try {
        const advRes = await advisoryService.getLatestAdvisory(user, false, lang);
        advisory = advRes?.advisory || null;
      } catch (e) {
        logger.warn(`Chat Context Advisory Fetch Failed: ${e.message}`);
      }
    }

    return { farm, weather, advisory };
  }

  /**
   * Generate AI response using Groq (llama-3.3-70b-versatile) with full context and history
   */
  async processMessage({ user, message, lang = 'en' }) {
    if (!this.groq && process.env.GROQ_API_KEY) {
      this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    }

    if (!this.groq) {
      throw new Error('Groq API Key missing (GROQ_API_KEY)');
    }

    const targetLangName = getLanguageName(lang);
    const context = await this.getFullContext(user, lang);
    const { farm, weather, advisory } = context;

    // Retrieve last 10 messages for context window memory
    const history = await ChatMessage.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const formattedHistory = history.reverse().map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content,
    }));

    const systemPrompt = `You are KrishiMitra AI, India's leading Senior Agronomist and Intelligent Farming Companion.

CRITICAL LANGUAGE REQUIREMENT:
You MUST respond strictly in the requested language: ${targetLangName} (Language code: ${lang}).
Format your output cleanly using standard GitHub-style markdown (bold headers, bullet points, numbered steps).
Do NOT include markdown code blocks (\`\`\`json or \`\`\`code).

FARMER TELEMETRY CONTEXT (DO NOT ASK THE FARMER TO REPEAT THIS DATA):
- Farmer Name: ${user.name}
- Active Farm: ${farm ? farm.farmName : 'No Active Farm Registered'}
- Location: ${farm?.address?.village || 'N/A'}, ${farm?.address?.district || 'N/A'}, ${farm?.address?.state || 'N/A'}
- Primary Crop: ${farm?.cropName || 'General Crop'} (Variety: ${farm?.cropVariety || 'Standard'})
- Sowing Date: ${farm?.sowingDate ? new Date(farm.sowingDate).toLocaleDateString() : 'N/A'}
- Soil Type: ${farm?.soilType || 'N/A'} | Area: ${farm?.area || 0} ${farm?.areaUnit || 'Acres'}
- Live Weather: ${weather?.current ? `${weather.current.temperature}°C, Humidity ${weather.current.humidity}%, Rain Chance ${weather.current.rainProbability}%, Wind ${weather.current.windSpeed} km/h` : 'Unavailable'}
- Agronomic Rules: ${weather?.agriculture ? JSON.stringify(weather.agriculture) : 'N/A'}
- Latest Groq Advisory: ${advisory ? `Health Score ${advisory.cropHealthScore}%, Priority ${advisory.priority}, Action: ${advisory.nextAction}, Warning: ${advisory.warning}` : 'None'}

Provide empathetic, concise, and highly practical agronomic advice.`;

    const messagesPayload = [
      { role: 'system', content: systemPrompt },
      ...formattedHistory,
      { role: 'user', content: message },
    ];

    logger.info(`Sending chat query to Groq AI (llama-3.3-70b-versatile) in [${targetLangName}]...`);

    const completion = await this.groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      messages: messagesPayload,
    });

    const aiAnswer = completion.choices[0]?.message?.content || 'I apologize, I am unable to generate a response at this moment.';

    // Store User Message & AI Response in MongoDB
    await ChatMessage.create({
      userId: user._id,
      farmId: farm?._id || null,
      role: 'user',
      content: message,
      language: lang,
    });

    const savedAiMsg = await ChatMessage.create({
      userId: user._id,
      farmId: farm?._id || null,
      role: 'assistant',
      content: aiAnswer,
      language: lang,
    });

    return {
      message: savedAiMsg,
      contextUsed: {
        farmName: farm?.farmName,
        crop: farm?.cropName,
        weather: weather?.current?.temperature,
      },
    };
  }

  /**
   * Fetch chat history (last 20 messages)
   */
  async getHistory(userId) {
    const messages = await ChatMessage.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return messages.reverse();
  }

  /**
   * Clear user's chat history
   */
  async clearHistory(userId) {
    await ChatMessage.deleteMany({ userId });
    return true;
  }
}

export default new ChatService();
