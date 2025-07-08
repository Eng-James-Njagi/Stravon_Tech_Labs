const axios = require('axios');
const aiConfig = require('../config/aiConfig');

class AIModelManager {
  constructor() {
    this.models = ['gemini', 'openai', 'huggingface', 'cohere'];
    this.currentModel = 'gemini';
    this.conversationContext = new Map();
    this.requestLimits = {
      gemini: { used: 0, limit: 1500, resetTime: Date.now() + 24 * 60 * 60 * 1000 },
      openai: { used: 0, limit: 2500, resetTime: Date.now() + 24 * 60 * 60 * 1000 },
      huggingface: { used: 0, limit: 1000, resetTime: Date.now() + 60 * 60 * 1000 },
      cohere: { used: 0, limit: 100, resetTime: Date.now() + 30 * 24 * 60 * 60 * 1000 }
    };
  }

  async getResponse(userMessage, conversationHistory, userId) {
    try {
      // Check if current model is available
      if (!this.isModelAvailable(this.currentModel)) {
        this.currentModel = this.getNextAvailableModel();
      }

      // Get conversation context
      const context = this.getConversationContext(userId, conversationHistory);
      
      // Generate response based on current model
      const response = await this.generateResponse(userMessage, context, this.currentModel);
      
      // Update conversation context
      this.updateConversationContext(userId, userMessage, response, context);
      
      // Update request limits
      this.updateRequestLimits(this.currentModel);
      
      return {
        response: response,
        model: this.currentModel,
        conversationStage: context.stage,
        suggestions: this.generateSuggestions(context)
      };
    } catch (error) {
      console.error('AI Model Manager Error:', error);
      return this.getFallbackResponse(userMessage);
    }
  }

  async generateResponse(userMessage, context, modelName) {
    const model = aiConfig.models[modelName];
    
    switch (modelName) {
      case 'gemini':
        return await this.callGemini(userMessage, context, model);
      case 'openai':
        return await this.callOpenAI(userMessage, context, model);
      case 'huggingface':
        return await this.callHuggingFace(userMessage, context, model);
      case 'cohere':
        return await this.callCohere(userMessage, context, model);
      default:
        throw new Error(`Unknown model: ${modelName}`);
    }
  }

  async callGemini(userMessage, context, model) {
    if (!model.apiKey) {
      throw new Error('Gemini API key not configured');
    }

    const prompt = this.buildPrompt(userMessage, context);
    
    const response = await axios.post(
      `${model.endpoint}?key=${model.apiKey}`,
      {
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: model.temperature,
          maxOutputTokens: model.maxTokens,
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000
      }
    );

    return response.data.candidates[0].content.parts[0].text;
  }

  async callOpenAI(userMessage, context, model) {
    if (!model.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const prompt = this.buildPrompt(userMessage, context);
    
    const response = await axios.post(
      model.endpoint,
      {
        model: model.model,
        messages: [
          { role: 'system', content: aiConfig.systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: model.temperature,
        max_tokens: model.maxTokens,
      },
      {
        headers: {
          'Authorization': `Bearer ${model.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000
      }
    );

    return response.data.choices[0].message.content;
  }

  async callHuggingFace(userMessage, context, model) {
    if (!model.apiKey) {
      throw new Error('HuggingFace API key not configured');
    }

    const prompt = this.buildPrompt(userMessage, context);
    
    const response = await axios.post(
      model.endpoint,
      {
        inputs: prompt,
        parameters: {
          temperature: model.temperature,
          max_new_tokens: model.maxTokens,
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${model.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 15000
      }
    );

    return response.data[0].generated_text.replace(prompt, '').trim();
  }

  async callCohere(userMessage, context, model) {
    if (!model.apiKey) {
      throw new Error('Cohere API key not configured');
    }

    const prompt = this.buildPrompt(userMessage, context);
    
    const response = await axios.post(
      model.endpoint,
      {
        model: model.model,
        prompt: prompt,
        temperature: model.temperature,
        max_tokens: model.maxTokens,
      },
      {
        headers: {
          'Authorization': `Bearer ${model.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000
      }
    );

    return response.data.generations[0].text;
  }

  buildPrompt(userMessage, context) {
    const stageGuidance = this.getStageGuidance(context.stage);
    const businessContext = context.businessType ? `Business type: ${context.businessType}. ` : '';
    const conversationHistory = context.messageCount > 1 ? `This is message ${context.messageCount} in the conversation. ` : '';
    
    return `${aiConfig.systemPrompt}

Current conversation stage: ${context.stage}
${stageGuidance}
${businessContext}${conversationHistory}

User message: "${userMessage}"

Respond as Sarah, keeping it conversational and under 100 words. Ask a follow-up question to understand their business better.`;
  }

  getStageGuidance(stage) {
    const guidance = aiConfig.conversationFlow[stage];
    if (!guidance) return '';
    
    return `Stage guidance: ${guidance.approach}. Focus on: ${guidance.focus}. Avoid: ${guidance.avoid}.`;
  }

  getConversationContext(userId, conversationHistory) {
    let context = this.conversationContext.get(userId) || {
      businessType: null,
      challenges: [],
      goals: [],
      stage: 'discovery',
      messageCount: 0,
      hasWebsite: null,
      readinessLevel: 'discovery'
    };

    // Update message count
    context.messageCount = conversationHistory.length;

    // Determine conversation stage based on message count and content
    if (context.messageCount <= 2) {
      context.stage = 'discovery';
    } else if (context.messageCount <= 4) {
      context.stage = 'exploration';
    } else if (context.messageCount <= 6) {
      context.stage = 'consultation';
    } else {
      context.stage = 'recommendation';
    }

    // Update context based on recent messages
    if (conversationHistory.length > 0) {
      // FIXED: Handle conversation history properly
      const lastMessageObj = conversationHistory[conversationHistory.length - 1];
      
      // Handle different possible structures of conversation history
      let lastMessage = '';
      if (typeof lastMessageObj === 'string') {
        lastMessage = lastMessageObj.toLowerCase();
      } else if (lastMessageObj && typeof lastMessageObj === 'object') {
        // Try different possible property names
        lastMessage = (lastMessageObj.content || 
                     lastMessageObj.message || 
                     lastMessageObj.text || 
                     lastMessageObj.userMessage || 
                     '').toLowerCase();
      }
      
      if (lastMessage) {
        this.updateContextFromMessage(context, lastMessage);
      }
    }

    return context;
  }

  updateContextFromMessage(context, message) {
    // Business type detection
    if (message.includes('restaurant') || message.includes('food')) {
      context.businessType = 'restaurant';
    } else if (message.includes('shop') || message.includes('store') || message.includes('sell')) {
      context.businessType = 'retail';
    } else if (message.includes('service') || message.includes('consult')) {
      context.businessType = 'service';
    }

    // Website status
    if (message.includes('no website') || message.includes('don\'t have')) {
      context.hasWebsite = false;
    } else if (message.includes('website') || message.includes('site')) {
      context.hasWebsite = true;
    }

    // Readiness level
    if (message.includes('price') || message.includes('cost') || message.includes('how much')) {
      context.readinessLevel = 'ready';
      context.stage = 'pricing';
    } else if (message.includes('help') || message.includes('need') || message.includes('want')) {
      context.readinessLevel = 'consultation';
    }
  }

  updateConversationContext(userId, userMessage, response, context) {
    this.conversationContext.set(userId, context);
  }

  generateSuggestions(context) {
    const suggestions = [];
    
    if (context.stage === 'discovery') {
      suggestions.push("Tell me about your business", "What challenges are you facing?", "What are your goals?");
    } else if (context.stage === 'exploration') {
      suggestions.push("How can we help?", "What's your timeline?", "What's your budget range?");
    } else if (context.stage === 'consultation') {
      suggestions.push("Show me your services", "What would you recommend?", "How do we get started?");
    }
    
    return suggestions;
  }

  isModelAvailable(modelName) {
    const limit = this.requestLimits[modelName];
    if (!limit) return false;
    
    // Check if limit has reset
    if (Date.now() > limit.resetTime) {
      limit.used = 0;
      // Reset time for next period
      switch (modelName) {
        case 'gemini':
        case 'openai':
          limit.resetTime = Date.now() + 24 * 60 * 60 * 1000;
          break;
        case 'huggingface':
          limit.resetTime = Date.now() + 60 * 60 * 1000;
          break;
        case 'cohere':
          limit.resetTime = Date.now() + 30 * 24 * 60 * 60 * 1000;
          break;
      }
    }
    
    return limit.used < limit.limit;
  }

  getNextAvailableModel() {
    for (const model of this.models) {
      if (this.isModelAvailable(model)) {
        return model;
      }
    }
    return 'gemini'; // Fallback to primary model
  }

  updateRequestLimits(modelName) {
    if (this.requestLimits[modelName]) {
      this.requestLimits[modelName].used++;
    }
  }

  getFallbackResponse(userMessage) {
    return {
      response: "I'm having trouble connecting right now, but I'd still love to help! What kind of business are you running? I'm curious about what challenges you're facing and how we might be able to help.",
      model: 'fallback',
      conversationStage: 'discovery',
      suggestions: ["Tell me about your business", "I need a website", "I'm just starting out"]
    };
  }
}

module.exports = AIModelManager;