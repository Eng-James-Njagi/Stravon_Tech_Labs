class ConversationManager {
    // Analyze conversation and determine stage/context
    analyzeConversation(conversationHistory, currentContext = {}) {
        const userMessages = conversationHistory.filter(msg => msg.role === 'user');
        const messageCount = userMessages.length;
        const allUserText = userMessages.map(msg => msg.content.toLowerCase()).join(' ');
        
        // Determine conversation stage based on patterns
        let stage = this.determineConversationStage(messageCount, allUserText, currentContext);
        
        // Extract context from conversation
        const context = this.extractConversationContext(conversationHistory, currentContext);
        
        // Calculate quality and lead scores
        const qualityScore = this.calculateQualityScore(conversationHistory, context);
        const leadScore = this.calculateLeadScore(context, stage);
        
        // Suggest services based on conversation
        const suggestedServices = this.suggestServices(context, allUserText);
        
        return {
            stage,
            context,
            qualityScore,
            leadScore,
            suggestedServices
        };
    }
    
    // Determine what stage the conversation is in
    determineConversationStage(messageCount, allUserText, currentContext) {
        // Stage 1: Initial greeting/introduction
        if (messageCount <= 2) return 1;
        
        // Stage 2: Business discovery
        if (messageCount <= 5 && !currentContext.businessInfo) return 2;
        
        // Stage 3: Challenge identification
        if (messageCount <= 8 && (!currentContext.challenges || currentContext.challenges.length === 0)) return 3;
        
        // Stage 4: Vision exploration
        if (messageCount <= 12 && (!currentContext.goals || currentContext.goals.length === 0)) return 4;
        
        // Stage 5: Solution discussion
        if (messageCount <= 15 && (!currentContext.servicesInterest || currentContext.servicesInterest.length === 0)) return 5;
        
        // Stage 6: Service recommendation
        if (messageCount <= 20 && !currentContext.pricingDiscussed) return 6;
        
        // Stage 7: Pricing discussion
        return 7;
    }
    
    // Extract context from conversation
    extractConversationContext(conversationHistory, currentContext) {
        const userMessages = conversationHistory.filter(msg => msg.role === 'user');
        const allUserText = userMessages.map(msg => msg.content.toLowerCase()).join(' ');
        
        const context = { ...currentContext };
        
        // Extract business information
        context.businessInfo = this.extractBusinessInfo(allUserText, context.businessInfo || {});
        
        // Extract challenges
        context.challenges = this.extractChallenges(allUserText, context.challenges || []);
        
        // Extract goals
        context.goals = this.extractGoals(allUserText, context.goals || []);
        
        // Extract service interests
        context.servicesInterest = this.extractServiceInterests(allUserText, context.servicesInterest || []);
        
        return context;
    }
    
    // Extract business information from text
    extractBusinessInfo(text, currentInfo = {}) {
        const businessInfo = { ...currentInfo };
        
        // Business type detection
        if (text.includes('startup') || text.includes('new business')) {
            businessInfo.type = 'startup';
        } else if (text.includes('established') || text.includes('existing business')) {
            businessInfo.type = 'established';
        }
        
        // Business size detection
        if (text.includes('small business') || text.includes('small company')) {
            businessInfo.size = 'small';
        } else if (text.includes('medium') || text.includes('growing')) {
            businessInfo.size = 'medium';
        } else if (text.includes('large') || text.includes('enterprise')) {
            businessInfo.size = 'large';
        }
        
        // Industry detection
        const industries = ['restaurant', 'retail', 'consulting', 'healthcare', 'education', 'real estate'];
        industries.forEach(industry => {
            if (text.includes(industry)) {
                businessInfo.industry = industry;
            }
        });
        
        return businessInfo;
    }
    
    // Extract challenges from text
    extractChallenges(text, currentChallenges = []) {
        const challenges = [...currentChallenges];
        
        const challengePatterns = [
            { pattern: /no website|don't have website|need website/i, challenge: 'No online presence' },
            { pattern: /low sales|poor sales|not selling/i, challenge: 'Low sales' },
            { pattern: /competitors|competition/i, challenge: 'Strong competition' },
            { pattern: /marketing|advertising|promotion/i, challenge: 'Marketing difficulties' },
            { pattern: /customers|clients|reach people/i, challenge: 'Customer acquisition' },
            { pattern: /old website|outdated|redesign/i, challenge: 'Outdated website' },
            { pattern: /mobile|responsive|phone/i, challenge: 'Mobile optimization' }
        ];
        
        challengePatterns.forEach(({ pattern, challenge }) => {
            if (pattern.test(text) && !challenges.includes(challenge)) {
                challenges.push(challenge);
            }
        });
        
        return challenges;
    }
    
    // Extract goals from text
    extractGoals(text, currentGoals = []) {
        const goals = [...currentGoals];
        
        const goalPatterns = [
            { pattern: /grow|increase|expand|scale/i, goal: 'Business growth' },
            { pattern: /online presence|web presence|digital/i, goal: 'Online presence' },
            { pattern: /more customers|more clients|attract/i, goal: 'Customer acquisition' },
            { pattern: /sales|revenue|profit/i, goal: 'Increase sales' },
            { pattern: /brand|branding|identity/i, goal: 'Brand development' },
            { pattern: /professional|credible|trust/i, goal: 'Professional image' },
            { pattern: /automate|efficiency|streamline/i, goal: 'Process automation' }
        ];
        
        goalPatterns.forEach(({ pattern, goal }) => {
            if (pattern.test(text) && !goals.includes(goal)) {
                goals.push(goal);
            }
        });
        
        return goals;
    }
    
    // Extract service interests from text
    extractServiceInterests(text, currentInterests = []) {
        const interests = [...currentInterests];
        
        const servicePatterns = [
            { pattern: /website|web/i, service: 'Website Development' },
            { pattern: /logo|design/i, service: 'Logo Design' },
            { pattern: /ecommerce|online store|shop/i, service: 'E-commerce' },
            { pattern: /marketing|advertising/i, service: 'Marketing Materials' },
            { pattern: /brand|branding/i, service: 'Brand Identity' },
            { pattern: /mobile|app/i, service: 'Mobile Development' }
        ];
        
        servicePatterns.forEach(({ pattern, service }) => {
            if (pattern.test(text) && !interests.includes(service)) {
                interests.push(service);
            }
        });
        
        return interests;
    }
    
    // Calculate conversation quality score
    calculateQualityScore(conversationHistory, context) {
        let score = 0;
        
        // Message depth (30 points)
        const messageCount = conversationHistory.filter(msg => msg.role === 'user').length;
        score += Math.min(messageCount * 3, 30);
        
        // Context richness (70 points)
        if (context.businessInfo && Object.keys(context.businessInfo).length > 0) score += 20;
        if (context.challenges && context.challenges.length > 0) score += 20;
        if (context.goals && context.goals.length > 0) score += 15;
        if (context.servicesInterest && context.servicesInterest.length > 0) score += 15;
        
        return Math.min(score, 100);
    }
    
    // Calculate lead score
    calculateLeadScore(context, stage) {
        let score = 0;
        
        // Stage progression (40 points)
        score += stage * 5;
        
        // Business information (25 points)
        if (context.businessInfo) {
            score += Object.keys(context.businessInfo).length * 5;
        }
        
        // Challenges identified (20 points)
        if (context.challenges) {
            score += context.challenges.length * 4;
        }
        
        // Goals discussed (15 points)
        if (context.goals) {
            score += context.goals.length * 3;
        }
        
        return Math.min(score, 100);
    }
    
    // Suggest services based on conversation
    suggestServices(context, allUserText) {
        const suggestions = [];
        
        // Website suggestions
        if (allUserText.includes('website') || allUserText.includes('web')) {
            if (context.businessInfo && context.businessInfo.type === 'startup') {
                suggestions.push('Basic Website');
            } else {
                suggestions.push('Business Website');
            }
        }
        
        // E-commerce suggestions
        if (allUserText.includes('sell') || allUserText.includes('products') || allUserText.includes('store')) {
            suggestions.push('E-commerce Website');
        }
        
        // Design suggestions
        if (allUserText.includes('logo') || allUserText.includes('design') || allUserText.includes('brand')) {
            suggestions.push('Logo Design');
            suggestions.push('Brand Identity');
        }
        
        // Marketing suggestions
        if (allUserText.includes('marketing') || allUserText.includes('advertising')) {
            suggestions.push('Marketing Materials');
        }
        
        return suggestions;
    }
}

module.exports = new ConversationManager();