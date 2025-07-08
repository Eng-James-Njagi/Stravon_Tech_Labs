const axios = require('axios');
const aiConfig = require('../config/aiConfig');

class AIModelManager {
  constructor() {
    // Updated model priority: Groq (fastest) → Mistral (good quality) → Gemini → Cohere
    this.models = ['groq', 'mistral', 'gemini', 'cohere'];
    this.currentModel = 'groq';
    this.conversationContext = new Map();
    this.requestLimits = {
      groq: { used: 0, limit: 6000, resetTime: Date.now() + 24 * 60 * 60 * 1000 },
      mistral: { used: 0, limit: 2000, resetTime: Date.now() + 24 * 60 * 60 * 1000 },
      gemini: { used: 0, limit: 1500, resetTime: Date.now() + 24 * 60 * 60 * 1000 },
      cohere: { used: 0, limit: 100, resetTime: Date.now() + 30 * 24 * 60 * 60 * 1000 }
    };
  }

  async getResponse(userMessage, conversationHistory, userId) {
    let attempts = 0;
    const maxAttempts = this.models.length;
    
    while (attempts < maxAttempts) {
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
        attempts++;
        console.error(`Attempt ${attempts} failed with model ${this.currentModel}:`, error.message);
        
        // Try next model
        const nextModel = this.getNextAvailableModel();
        if (nextModel !== this.currentModel) {
          this.currentModel = nextModel;
          continue;
        }
        
        // If all models failed, return fallback
        if (attempts >= maxAttempts) {
          console.error('All AI models failed, returning fallback response');
          return this.getFallbackResponse(userMessage);
        }
      }
    }
  }

  async generateResponse(userMessage, context, modelName) {
    const model = aiConfig.models[modelName];
    
    try {
      switch (modelName) {
        case 'groq':
          return await this.callGroq(userMessage, context, model);
        case 'mistral':
          return await this.callMistral(userMessage, context, model);
        case 'gemini':
          return await this.callGemini(userMessage, context, model);
        case 'cohere':
          return await this.callCohere(userMessage, context, model);
        default:
          throw new Error(`Unknown model: ${modelName}`);
      }
    } catch (error) {
      // Handle rate limit errors specifically
      if (error.response?.status === 429 || error.code === 'RATE_LIMIT_EXCEEDED') {
        console.log(`Rate limit hit for ${modelName}, switching to next model`);
        
        // Mark current model as unavailable
        this.requestLimits[modelName].used = this.requestLimits[modelName].limit;
        
        // Get next available model
        const nextModel = this.getNextAvailableModel();
        
        // If we have a different model available, try it
        if (nextModel && nextModel !== modelName) {
          console.log(`Switching from ${modelName} to ${nextModel}`);
          this.currentModel = nextModel;
          return await this.generateResponse(userMessage, context, nextModel);
        }
      }
      
      // Re-throw the error if it's not a rate limit or no alternatives
      throw error;
    }
  }

  async callGroq(userMessage, context, model) {
    if (!model.apiKey) {
      throw new Error('Groq API key not configured');
    }

    const prompt = this.buildPrompt(userMessage, context);
    
    try {
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
    } catch (error) {
      console.error('Groq API Error:', {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data
      });
      
      const enhancedError = new Error(`Groq API failed: ${error.message}`);
      enhancedError.response = error.response;
      enhancedError.originalError = error;
      throw enhancedError;
    }
  }

  async callMistral(userMessage, context, model) {
    if (!model.apiKey) {
      throw new Error('Mistral API key not configured');
    }

    const prompt = this.buildPrompt(userMessage, context);
    
    try {
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
    } catch (error) {
      console.error('Mistral API Error:', {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data
      });
      
      const enhancedError = new Error(`Mistral API failed: ${error.message}`);
      enhancedError.response = error.response;
      enhancedError.originalError = error;
      throw enhancedError;
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
    const isPricingQuestion = this.isPricingQuestion(userMessage);
    const isServiceQuestion = this.isServiceQuestion(userMessage);
    
    let stageGuidance = '';
    let responseStrategy = '';
    
    if (isPricingQuestion) {
        responseStrategy = `The user is asking about pricing. IMMEDIATELY provide the exact pricing ranges and what's included, then show interest in their business to recommend the best option.`;
        context.stage = 'pricing_inquiry';
    } else if (isServiceQuestion) {
        responseStrategy = `The user is asking about services. Explain the service thoroughly with details and benefits, then ask about their specific needs.`;
        context.stage = 'service_inquiry';
    } else {
        stageGuidance = this.getStageGuidance(context.stage);
        responseStrategy = `Focus on discovery and understanding their business needs.`;
    }
    
    const businessContext = context.businessType ? `Business type: ${context.businessType}. ` : '';
    const conversationHistory = context.messageCount > 1 ? `This is message ${context.messageCount} in the conversation. ` : '';
    
    return `${aiConfig.systemPrompt}

    Current conversation stage: ${context.stage}
    ${stageGuidance}
    ${responseStrategy}
    ${businessContext}${conversationHistory}

    User message: "${userMessage}"

    Response instructions:
    - If this is a pricing question: Give exact pricing first, explain what's included, then ask about their business
    - If this is a service question: Explain the service thoroughly, then show interest in their needs
    - Keep responses conversational and under 150 words
    - Always end with a question to understand their business better`;
}
isPricingQuestion(message) {
    const pricingKeywords = [
        'price', 'cost', 'how much', 'pricing', 'rates', 'charges', 'fee', 'fees',
        'budget', 'quote', 'estimate', 'afford', 'expensive', 'cheap', 'investment'
    ];
    
    const lowerMessage = message.toLowerCase();
    return pricingKeywords.some(keyword => lowerMessage.includes(keyword));
}

isServiceQuestion(message) {
    const serviceKeywords = [
        'what do you do', 'services', 'what can you', 'what do you offer',
        'website', 'web development', 'graphic design', 'logo', 'branding',
        'e-commerce', 'online store', 'help me', 'can you help'
    ];
    
    const lowerMessage = message.toLowerCase();
    return serviceKeywords.some(keyword => lowerMessage.includes(keyword));
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
        readinessLevel: 'discovery',
        hasPricingInfo: false
    };

    // Update message count
    context.messageCount = conversationHistory.length;

    // Check if user has asked about pricing or services
    if (conversationHistory.length > 0) {
        const lastMessageObj = conversationHistory[conversationHistory.length - 1];
        
        let lastMessage = '';
        if (typeof lastMessageObj === 'string') {
            lastMessage = lastMessageObj.toLowerCase();
        } else if (lastMessageObj && typeof lastMessageObj === 'object') {
            lastMessage = (lastMessageObj.content || 
                         lastMessageObj.message || 
                         lastMessageObj.text || 
                         lastMessageObj.userMessage || 
                         '').toLowerCase();
        }
        
        if (lastMessage) {
            // Check for pricing questions
            if (this.isPricingQuestion(lastMessage)) {
                context.stage = 'pricing_inquiry';
                context.readinessLevel = 'pricing';
                context.hasPricingInfo = true;
            }
            // Check for service questions
            else if (this.isServiceQuestion(lastMessage)) {
                context.stage = 'service_inquiry';
                context.readinessLevel = 'consultation';
            }
            // Normal conversation flow
            else {
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
            }
            
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

    // Don't override pricing stage with readiness level
    if (context.stage !== 'pricing_inquiry' && context.stage !== 'service_inquiry') {
        if (message.includes('help') || message.includes('need') || message.includes('want')) {
            context.readinessLevel = 'consultation';
        }
    }
}

  updateConversationContext(userId, userMessage, response, context) {
    this.conversationContext.set(userId, context);
  }

 generateSuggestions(context) {
    const suggestions = [];
    
    if (context.stage === 'pricing_inquiry') {
        suggestions.push("Tell me about your business", "What type of website do you need?", "When do you want to start?");
    } else if (context.stage === 'service_inquiry') {
        suggestions.push("What are your specific needs?", "What's your timeline?", "How much would this cost?");
    } else if (context.stage === 'discovery') {
        suggestions.push("Tell me about your business", "What challenges are you facing?", "What services do you offer?");
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
        case 'groq':
        case 'mistral':
        case 'gemini':
          limit.resetTime = Date.now() + 24 * 60 * 60 * 1000;
          break;
        case 'cohere':
          limit.resetTime = Date.now() + 30 * 24 * 60 * 60 * 1000;
          break;
      }
    }
    
    return limit.used < limit.limit;
  }

  getNextAvailableModel() {
    // Get current model index
    const currentIndex = this.models.indexOf(this.currentModel);
    
    // Try models starting from the next one
    for (let i = 1; i < this.models.length; i++) {
      const nextIndex = (currentIndex + i) % this.models.length;
      const model = this.models[nextIndex];
      
      if (this.isModelAvailable(model)) {
        return model;
      }
    }
    
    return this.models[0];
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