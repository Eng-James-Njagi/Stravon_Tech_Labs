const axios = require('axios');
const aiConfig = require('../config/aiConfig');

class AIService {
    constructor() {
        this.systemPrompt = `You are Sarah, a friendly project coordinator at Stravon Tech Labs in Kangare, Murang'a. 
You're genuinely curious about people's businesses and love helping them figure out what they really need.

CONVERSATION STYLE:
- Be naturally curious and engaging like Claude
- Ask follow-up questions about their business
- Let them guide the conversation pace
- Show genuine interest in their success
- Build rapport before making recommendations

PROGRESSIVE APPROACH:
- Start with discovery, not solutions
- Understand their world before suggesting services
- Only share pricing when they're ready for specifics
- Focus on their needs, not our services initially

CRITICAL PRICING RULES (Only when ready):
- Basic Website: EXACTLY "KES 8,000 - 15,000"
- Business Website: EXACTLY "KES 15,000 - 30,000"
- E-commerce: EXACTLY "KES 25,000 - 50,000"
- Premium Solutions: EXACTLY "KES 50,000 - 350,000"
- Logo Design: EXACTLY "KES 2,000 - 10,000"
- Brand Identity: EXACTLY "KES 5,000 - 25,000"
- Marketing Materials: EXACTLY "KES 1,000 - 15,000"

CONVERSATION STAGES:
1. Warm Introduction: Personal, welcoming, curious
2. Business Discovery: Understanding their world
3. Challenge Identification: What's not working for them
4. Vision Exploration: What they're trying to achieve
5. Solution Discussion: Collaborative exploration
6. Service Recommendation: Tailored to their needs
7. Pricing Discussion: When they're ready to move forward

STAY FOCUSED ON:
- Web development and graphic design only
- Their business challenges and goals
- Building genuine connections
- Consultative approach

AVOID:
- Immediate service listings
- Early pricing discussions
- Pushy sales tactics
- Generic responses`;
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

    async callOpenAI(userMessage, conversationHistory) {
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
                aiConfig.models.openai.endpoint,
                {
                    model: 'gpt-3.5-turbo',
                    messages: messages,
                    temperature: aiConfig.models.openai.temperature,
                    max_tokens: aiConfig.models.openai.maxTokens,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${aiConfig.models.openai.apiKey}`,
                        'Content-Type': 'application/json',
                    }
                }
            );

            return response.data.choices[0].message.content;
        } catch (error) {
            console.error('OpenAI API Error:', error.response?.data || error.message);
            throw error;
        }
    }

    async callHuggingFace(userMessage, conversationHistory) {
        try {
            const prompt = `${this.systemPrompt}\n\nConversation:\n${conversationHistory.join('\n')}\n\nUser: ${userMessage}\n\nSarah:`;
            
            const response = await axios.post(
                aiConfig.models.huggingface.endpoint,
                {
                    inputs: prompt,
                    parameters: {
                        temperature: aiConfig.models.huggingface.temperature,
                        max_new_tokens: aiConfig.models.huggingface.maxTokens,
                        return_full_text: false
                    }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${aiConfig.models.huggingface.apiKey}`,
                        'Content-Type': 'application/json',
                    }
                }
            );

            return response.data[0].generated_text;
        } catch (error) {
            console.error('Hugging Face API Error:', error.response?.data || error.message);
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
            case 'gemini':
                return await this.callGemini(userMessage, conversationHistory);
            case 'openai':
                return await this.callOpenAI(userMessage, conversationHistory);
            case 'huggingface':
                return await this.callHuggingFace(userMessage, conversationHistory);
            case 'cohere':
                return await this.callCohere(userMessage, conversationHistory);
            default:
                throw new Error(`Unsupported AI model: ${model}`);
        }
    }
}

module.exports = AIService;