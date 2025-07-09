const axios = require('axios');
const aiConfig = require('../config/aiConfig');

class AIService {
   constructor() {
        this.systemPrompt = `You are Sarah, a friendly project coordinator at Stravon Tech Labs in Maragua, Murang'a.
        You guide people to decide about there project and then direct them to the packages once satisfaction is reached 
You're genuinely curious about people's businesses and love helping them figure out what they really need.

CONVERSATION STYLE:
- Be naturally curious and engaging like Claude
- Answer direct questions immediately and thoroughly
- Show genuine interest in their success after providing requested information
- Build rapport through helpful responses

RESPONSE PRIORITY:
- If they ask for pricing: Give complete pricing details first, then show interest in their business
- If they ask about services: Explain the service thoroughly, then ask about their needs
- If they're exploring: Start with discovery and understanding their world
- Always end with genuine curiosity about their business

CRITICAL PRICING RULES (Give immediately when asked):
- Landing Pages: EXACTLY "KES 8,000" (Single page responsive design,contact form integration, Social Media connectivity)
- Basic Website: EXACTLY "KES 12,000 - 25,000" (Simple business presence, 3-6  custom pages, contact forms,analytics setup,SEO optimization, mobile responsive)
- Business Website: EXACTLY "KES 60,000 - 120,000" (Professional site, 5-16 pages, advanced SEO features, admin panel, user-account system)
- E-commerce: EXACTLY "KES 120,000 - 200,000" (Online store, payment integration, inventory management, user accounts)
- Premium Solutions: EXACTLY "KES 200,000 - 350,000" (Custom features, complex functionality, integrations)
- Logo Design: EXACTLY "KES 2,000 - 10,000" (Professional logo design, multiple concepts, revisions)
- Brand Identity: EXACTLY "KES 5,000 - 25,000" (Complete brand package, colors, fonts, guidelines)
- Marketing Materials: EXACTLY "KES 1,000 - 15,000" (Business cards, flyers, brochures, social media graphics)

PRICING RESPONSE FORMAT:
When asked about pricing, respond like this:
1. Give the exact pricing range
2. Explain what's included in that price range
3. Mention any key features or benefits
4. THEN show interest: "I'd love to learn more about your business to recommend the best option for you. What kind of business are you running?"

CONVERSATION APPROACH:
- Direct questions get direct answers first
- Always follow up with genuine curiosity
- Build connections through helpfulness
- Be consultative but not pushy

STAY FOCUSED ON:
- Web development and graphic design only
- Their business challenges and goals after answering their question
- Building genuine connections through helpful responses
- Immediate value followed by relationship building

AVOID:
- Delaying answers to direct questions
- Making them work for basic information
- Generic responses without specific details
- Pushy sales tactics`;
    }

    async callGroq(userMessage, conversationHistory) {
        try {
            const messages = [
                { role: 'system', content: this.systemPrompt },
                ...conversationHistory.map((msg, index) => ({
                    role: index % 2 === 0 ? 'user' : 'assistant',
                    content: msg
                })),
                { role: 'user', content: userMessage }
            ];

            const response = await axios.post(
                aiConfig.models.groq.endpoint,
                {
                    model: aiConfig.models.groq.model,
                    messages: messages,
                    temperature: aiConfig.models.groq.temperature,
                    max_tokens: aiConfig.models.groq.maxTokens,
                    stream: false
                },
                {
                    headers: {
                        'Authorization': `Bearer ${aiConfig.models.groq.apiKey}`,
                        'Content-Type': 'application/json',
                    }
                }
            );

            return response.data.choices[0].message.content;
        } catch (error) {
            console.error('Groq API Error:', error.response?.data || error.message);
            throw error;
        }
    }

    async callMistral(userMessage, conversationHistory) {
        try {
            const messages = [
                { role: 'system', content: this.systemPrompt },
                ...conversationHistory.map((msg, index) => ({
                    role: index % 2 === 0 ? 'user' : 'assistant',
                    content: msg
                })),
                { role: 'user', content: userMessage }
            ];

            const response = await axios.post(
                aiConfig.models.mistral.endpoint,
                {
                    model: aiConfig.models.mistral.model,
                    messages: messages,
                    temperature: aiConfig.models.mistral.temperature,
                    max_tokens: aiConfig.models.mistral.maxTokens,
                    stream: false
                },
                {
                    headers: {
                        'Authorization': `Bearer ${aiConfig.models.mistral.apiKey}`,
                        'Content-Type': 'application/json',
                    }
                }
            );

            return response.data.choices[0].message.content;
        } catch (error) {
            console.error('Mistral API Error:', error.response?.data || error.message);
            throw error;
        }
    }

    async callGemini(userMessage, conversationHistory) {
        try {
            const response = await axios.post(
                `${aiConfig.models.gemini.endpoint}?key=${aiConfig.models.gemini.apiKey}`,
                {
                    contents: [{
                        parts: [{
                            text: `${this.systemPrompt}\n\nConversation History:\n${conversationHistory.join('\n')}\n\nUser: ${userMessage}\n\nSarah:`
                        }]
                    }],
                    generationConfig: {
                        temperature: aiConfig.models.gemini.temperature,
                        maxOutputTokens: aiConfig.models.gemini.maxTokens,
                    }
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            return response.data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error('Gemini API Error:', error.response?.data || error.message);
            throw error;
        }
    }

    async callCohere(userMessage, conversationHistory) {
        try {
            const prompt = `${this.systemPrompt}\n\nConversation History:\n${conversationHistory.join('\n')}\n\nUser: ${userMessage}\n\nSarah:`;
            
            const response = await axios.post(
                aiConfig.models.cohere.endpoint,
                {
                    prompt: prompt,
                    max_tokens: aiConfig.models.cohere.maxTokens,
                    temperature: aiConfig.models.cohere.temperature,
                    k: 0,
                    stop_sequences: ['\nUser:'],
                    return_likelihoods: 'NONE'
                },
                {
                    headers: {
                        'Authorization': `Bearer ${aiConfig.models.cohere.apiKey}`,
                        'Content-Type': 'application/json',
                    }
                }
            );

            return response.data.generations[0].text.trim();
        } catch (error) {
            console.error('Cohere API Error:', error.response?.data || error.message);
            throw error;
        }
    }

    async getResponse(model, userMessage, conversationHistory) {
        switch (model) {
            case 'groq':
                return await this.callGroq(userMessage, conversationHistory);
            case 'mistral':
                return await this.callMistral(userMessage, conversationHistory);
            case 'gemini':
                return await this.callGemini(userMessage, conversationHistory);
            case 'cohere':
                return await this.callCohere(userMessage, conversationHistory);
            default:
                throw new Error(`Unsupported AI model: ${model}`);
        }
    }
}

module.exports = AIService;