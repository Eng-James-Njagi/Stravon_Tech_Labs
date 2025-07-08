const AIModelManager = require('../services/aiModelManager');
const conversationManager = require('../services/conversationManager');
const PricingService = require('../services/pricingService'); // Import the class

class AIController {
    constructor() {
        this.aiManager = new AIModelManager();
        this.pricingService = new PricingService(); // Instantiate the class
        this.activeSessions = new Map();
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
                modelUsed: this.aiManager.currentModel
            });

        } catch (error) {
            console.error('AI Controller Error:', error);
            
            // Fallback response
            res.json({
                success: true,
                response: "I'm sorry, I'm having some technical difficulties right now. Let me connect you with our team directly. You can reach us at info@stravontechlabs.com or call us. We'd love to help with your project!",
                fallback: true,
                error: error.message
            });
        }
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
                }
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