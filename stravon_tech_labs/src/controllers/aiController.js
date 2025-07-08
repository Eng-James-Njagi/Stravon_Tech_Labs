const AIModelManager = require('../services/aiModelManager');
const conversationManager = require('../services/conversationManager');
const PricingService = require('../services/pricingService'); // Import the class

class AIController {
    constructor() {
        this.aiManager = new AIModelManager();
        this.pricingService = new PricingService(); // Instantiate the class
        this.activeSessions = new Map();
        
        // Track model usage for monitoring
        this.modelUsageStats = {
            groq: { requests: 0, errors: 0, lastUsed: null },
            mistral: { requests: 0, errors: 0, lastUsed: null },
            gemini: { requests: 0, errors: 0, lastUsed: null },
            cohere: { requests: 0, errors: 0, lastUsed: null }
        };
    }

    // Handle chat messages with enhanced logic
    async handleChatMessage(req, res) {
        try {
            const { message, sessionId, userId } = req.body;
            
            // Input validation
            if (!message || !sessionId) {
                return res.status(400).json({
                    error: 'Message and session ID are required',
                    success: false
                });
            }

            // Get or create conversation session
            let session = this.activeSessions.get(sessionId) || {
                conversationHistory: [],
                currentStage: 1,
                userProfile: {},
                conversationContext: {},
                startTime: new Date(),
                lastActivity: new Date()
            };

            // Update session activity
            session.lastActivity = new Date();
            session.conversationHistory.push({
                role: 'user',
                content: message,
                timestamp: new Date()
            });

            // Analyze conversation stage and context
            const conversationAnalysis = conversationManager.analyzeConversation(
                session.conversationHistory,
                session.conversationContext
            );

            // Update conversation stage
            session.currentStage = conversationAnalysis.stage;
            session.conversationContext = conversationAnalysis.context;

            // Check if pricing discussion is appropriate - use this.pricingService
            const pricingReady = this.pricingService.checkPricingTiming(session.conversationHistory);
            
            // Get AI response with progressive disclosure
            const aiResponse = await this.aiManager.getResponse(
                message,
                session.conversationHistory,
                userId,
                {
                    stage: session.currentStage,
                    context: session.conversationContext,
                    pricingReady: pricingReady
                }
            );

            // Track model usage
            this.updateModelUsageStats(this.aiManager.currentModel, false);

            // Validate pricing in response - use this.pricingService
            const validatedResponse = this.pricingService.validatePricing(
                aiResponse,
                session.currentStage
            );

            // Add response to conversation history
            session.conversationHistory.push({
                role: 'assistant',
                content: validatedResponse,
                timestamp: new Date(),
                stage: session.currentStage
            });

            // Save session
            this.activeSessions.set(sessionId, session);

            // Generate conversation summary for potential lead
            const conversationSummary = this.generateConversationSummary(session);

            // Response with enhanced data
            res.json({
                success: true,
                response: validatedResponse,
                sessionData: {
                    stage: session.currentStage,
                    conversationDepth: session.conversationHistory.length,
                    conversationQuality: conversationAnalysis.qualityScore,
                    leadScore: conversationAnalysis.leadScore,
                    suggestedServices: conversationAnalysis.suggestedServices,
                    pricingDiscussed: pricingReady
                },
                conversationSummary: conversationSummary,
                modelUsed: this.aiManager.currentModel,
                modelPerformance: this.getModelPerformanceInfo()
            });

        } catch (error) {
            console.error('AI Controller Error:', error);
            
            // Track model error
            if (this.aiManager.currentModel) {
                this.updateModelUsageStats(this.aiManager.currentModel, true);
            }

            // Enhanced fallback response based on error type
            let fallbackResponse = this.generateFallbackResponse(error);
            
            res.json({
                success: true,
                response: fallbackResponse,
                fallback: true,
                error: error.message,
                modelUsed: this.aiManager.currentModel,
                errorType: this.categorizeError(error)
            });
        }
    }

    // Update model usage statistics
    updateModelUsageStats(model, isError = false) {
        if (this.modelUsageStats[model]) {
            this.modelUsageStats[model].requests++;
            this.modelUsageStats[model].lastUsed = new Date();
            
            if (isError) {
                this.modelUsageStats[model].errors++;
            }
        }
    }

    // Get model performance information
    getModelPerformanceInfo() {
        const currentModel = this.aiManager.currentModel;
        if (!currentModel || !this.modelUsageStats[currentModel]) {
            return null;
        }

        const stats = this.modelUsageStats[currentModel];
        return {
            model: currentModel,
            requests: stats.requests,
            errors: stats.errors,
            errorRate: stats.requests > 0 ? (stats.errors / stats.requests * 100).toFixed(2) : 0,
            lastUsed: stats.lastUsed
        };
    }

    // Generate appropriate fallback response based on error
    generateFallbackResponse(error) {
        const errorMessage = error.message?.toLowerCase() || '';
        
        // Rate limiting errors (especially for Groq)
        if (errorMessage.includes('rate limit') || errorMessage.includes('quota') || errorMessage.includes('429')) {
            return "I'm experiencing high demand right now, but I'm here to help! Let me connect you directly with our team. You can reach us at midnightalpha031@gmail.com or call 0105140326. We'd love to discuss your project needs!";
        }
        
        // API key or authentication errors
        if (errorMessage.includes('unauthorized') || errorMessage.includes('api key') || errorMessage.includes('401')) {
            return "I'm having some technical difficulties with my systems. Please reach out to our team directly at midnightalpha031@gmail.com or call 0105140326. We're ready to help with your web development and design needs!";
        }
        
        // Network or connection errors
        if (errorMessage.includes('network') || errorMessage.includes('timeout') || errorMessage.includes('connection')) {
            return "I'm experiencing connectivity issues right now. Don't worry - our team is still available to help! Contact us at midnightalpha031@gmail.com or call 0105140326 to discuss your project.";
        }
        
        // Model-specific errors
        if (errorMessage.includes('groq') || errorMessage.includes('mistral')) {
            return "I'm switching to backup systems to ensure I can help you. If you need immediate assistance, please contact our team at midnightalpha031@gmail.com or call 0105140326. We're here to support your business goals!";
        }
        
        // Default fallback
        return "I'm sorry, I'm having some technical difficulties right now. Let me connect you with our team directly. You can reach us at midnightalpha031@gmail.com or call 0105140326. We'd love to help with your project!";
    }

    // Categorize error types for better monitoring
    categorizeError(error) {
        const errorMessage = error.message?.toLowerCase() || '';
        
        if (errorMessage.includes('rate limit') || errorMessage.includes('quota') || errorMessage.includes('429')) {
            return 'RATE_LIMIT';
        }
        
        if (errorMessage.includes('unauthorized') || errorMessage.includes('api key') || errorMessage.includes('401')) {
            return 'AUTHENTICATION';
        }
        
        if (errorMessage.includes('network') || errorMessage.includes('timeout') || errorMessage.includes('connection')) {
            return 'NETWORK';
        }
        
        if (errorMessage.includes('groq')) {
            return 'GROQ_ERROR';
        }
        
        if (errorMessage.includes('mistral')) {
            return 'MISTRAL_ERROR';
        }
        
        if (errorMessage.includes('gemini')) {
            return 'GEMINI_ERROR';
        }
        
        if (errorMessage.includes('cohere')) {
            return 'COHERE_ERROR';
        }
        
        return 'UNKNOWN';
    }

    // Generate conversation summary for lead tracking
    generateConversationSummary(session) {
        const userMessages = session.conversationHistory.filter(msg => msg.role === 'user');
        const assistantMessages = session.conversationHistory.filter(msg => msg.role === 'assistant');
        
        return {
            totalMessages: session.conversationHistory.length,
            userMessages: userMessages.length,
            assistantMessages: assistantMessages.length,
            conversationDuration: new Date() - session.startTime,
            currentStage: session.currentStage,
            keyTopics: this.extractKeyTopics(session.conversationHistory),
            businessInfo: session.conversationContext.businessInfo || {},
            challengesDiscussed: session.conversationContext.challenges || [],
            goalsDiscussed: session.conversationContext.goals || [],
            servicesInterest: session.conversationContext.servicesInterest || [],
            pricingDiscussed: session.conversationContext.pricingDiscussed || false,
            leadQuality: this.calculateLeadQuality(session)
        };
    }

    // Extract key topics from conversation
    extractKeyTopics(conversationHistory) {
        const allText = conversationHistory
            .filter(msg => msg.role === 'user')
            .map(msg => msg.content.toLowerCase())
            .join(' ');

        const topics = [];
        
        // Business-related keywords
        if (allText.includes('business') || allText.includes('company')) {
            topics.push('business');
        }
        
        // Service-related keywords
        if (allText.includes('website') || allText.includes('web')) {
            topics.push('website');
        }
        
        if (allText.includes('logo') || allText.includes('design')) {
            topics.push('design');
        }
        
        if (allText.includes('ecommerce') || allText.includes('online store') || allText.includes('shop')) {
            topics.push('ecommerce');
        }
        
        if (allText.includes('marketing') || allText.includes('advertising')) {
            topics.push('marketing');
        }
        
        // Challenge-related keywords
        if (allText.includes('problem') || allText.includes('challenge') || allText.includes('difficult')) {
            topics.push('challenges');
        }
        
        // Growth-related keywords
        if (allText.includes('grow') || allText.includes('expand') || allText.includes('increase')) {
            topics.push('growth');
        }
        
        return topics;
    }

    // Calculate lead quality score
    calculateLeadQuality(session) {
        let score = 0;
        
        // Conversation depth (20 points max)
        const messageCount = session.conversationHistory.filter(msg => msg.role === 'user').length;
        score += Math.min(messageCount * 2, 20);
        
        // Business information shared (25 points max)
        if (session.conversationContext.businessInfo) {
            score += Object.keys(session.conversationContext.businessInfo).length * 5;
        }
        
        // Challenges discussed (20 points max)
        if (session.conversationContext.challenges) {
            score += session.conversationContext.challenges.length * 5;
        }
        
        // Goals discussed (20 points max)
        if (session.conversationContext.goals) {
            score += session.conversationContext.goals.length * 5;
        }
        
        // Services interest (15 points max)
        if (session.conversationContext.servicesInterest) {
            score += session.conversationContext.servicesInterest.length * 3;
        }
        
        return Math.min(score, 100);
    }

    // Get conversation data for form pre-population
    async getConversationData(req, res) {
        try {
            const { sessionId } = req.params;
            
            const session = this.activeSessions.get(sessionId);
            if (!session) {
                return res.status(404).json({
                    error: 'Session not found',
                    success: false
                });
            }

            const conversationSummary = this.generateConversationSummary(session);
            
            res.json({
                success: true,
                conversationData: conversationSummary,
                formData: {
                    businessInfo: session.conversationContext.businessInfo || {},
                    servicesInterest: session.conversationContext.servicesInterest || [],
                    challenges: session.conversationContext.challenges || [],
                    goals: session.conversationContext.goals || [],
                    conversationSummary: this.formatConversationForEmail(session)
                },
                modelStats: this.modelUsageStats
            });

        } catch (error) {
            console.error('Error getting conversation data:', error);
            res.status(500).json({
                error: 'Internal server error',
                success: false
            });
        }
    }

    // Format conversation for email
    formatConversationForEmail(session) {
        const summary = [];
        
        summary.push(`Conversation Summary - ${new Date().toLocaleDateString()}`);
        summary.push(`Duration: ${Math.round((new Date() - session.startTime) / 1000 / 60)} minutes`);
        summary.push(`Total Messages: ${session.conversationHistory.length}`);
        summary.push(`Current Stage: ${session.currentStage}`);
        summary.push('');
        
        // Key topics
        const topics = this.extractKeyTopics(session.conversationHistory);
        if (topics.length > 0) {
            summary.push(`Key Topics: ${topics.join(', ')}`);
        }
        
        // Business information
        if (session.conversationContext.businessInfo) {
            summary.push('Business Information:');
            Object.entries(session.conversationContext.businessInfo).forEach(([key, value]) => {
                summary.push(`  ${key}: ${value}`);
            });
        }
        
        // Services interest
        if (session.conversationContext.servicesInterest && session.conversationContext.servicesInterest.length > 0) {
            summary.push(`Services Interest: ${session.conversationContext.servicesInterest.join(', ')}`);
        }
        
        // Lead quality
        const leadQuality = this.calculateLeadQuality(session);
        summary.push(`Lead Quality Score: ${leadQuality}/100`);
        
        return summary.join('\n');
    }

    // Get model usage statistics (for monitoring)
    getModelUsageStats() {
        return {
            ...this.modelUsageStats,
            totalRequests: Object.values(this.modelUsageStats).reduce((sum, stat) => sum + stat.requests, 0),
            totalErrors: Object.values(this.modelUsageStats).reduce((sum, stat) => sum + stat.errors, 0)
        };
    }

    // Clean up old sessions (call periodically)
    cleanupOldSessions() {
        const now = new Date();
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        
        for (const [sessionId, session] of this.activeSessions) {
            if (now - session.lastActivity > maxAge) {
                this.activeSessions.delete(sessionId);
            }
        }
    }
}

module.exports = new AIController();