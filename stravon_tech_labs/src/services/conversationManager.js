class ConversationManager {
    constructor() {
        this.conversationCache = new Map();
        this.performanceMetrics = {
            totalAnalyses: 0,
            averageAnalysisTime: 0,
            stageDistribution: {},
            errorCount: 0,
            cacheHitRate: 0
        };
        this.cacheHits = 0;
        this.cacheMisses = 0;
    }

    // Enhanced conversation analysis with performance tracking
    analyzeConversation(conversationHistory, currentContext = {}, options = {}) {
        const startTime = Date.now();
        
        try {
            // Generate cache key for conversation analysis
            const cacheKey = this.generateCacheKey(conversationHistory, currentContext);
            
            // Check cache first for performance
            if (this.conversationCache.has(cacheKey) && !options.forceRefresh) {
                this.cacheHits++;
                this.updateCacheHitRate();
                return this.conversationCache.get(cacheKey);
            }
            
            this.cacheMisses++;
            this.updateCacheHitRate();
            
            const userMessages = conversationHistory.filter(msg => msg.role === 'user');
            const messageCount = userMessages.length;
            const allUserText = userMessages.map(msg => msg.content.toLowerCase()).join(' ');
            
            // Determine conversation stage with enhanced logic
            let stage = this.determineConversationStage(messageCount, allUserText, currentContext);
            
            // Extract context with improved pattern matching
            const context = this.extractConversationContext(conversationHistory, currentContext);
            
            // Calculate enhanced quality and lead scores
            const qualityScore = this.calculateQualityScore(conversationHistory, context);
            const leadScore = this.calculateLeadScore(context, stage);
            
            // Suggest services with improved matching
            const suggestedServices = this.suggestServices(context, allUserText);
            
            // Generate conversation insights for AI models
            const conversationInsights = this.generateConversationInsights(context, stage, qualityScore);
            
            // Determine next best actions
            const nextActions = this.determineNextActions(stage, context, qualityScore);
            
            const result = {
                stage,
                context,
                qualityScore,
                leadScore,
                suggestedServices,
                conversationInsights,
                nextActions,
                analysisMetadata: {
                    messageCount,
                    analysisTime: Date.now() - startTime,
                    cacheUsed: false,
                    timestamp: new Date().toISOString()
                }
            };
            
            // Cache the result
            this.conversationCache.set(cacheKey, result);
            
            // Update performance metrics
            this.updatePerformanceMetrics(result, Date.now() - startTime);
            
            return result;
            
        } catch (error) {
            this.performanceMetrics.errorCount++;
            console.error('ConversationManager Analysis Error:', error);
            
            // Return fallback analysis
            return this.getFallbackAnalysis(conversationHistory, currentContext);
        }
    }
    
    // Enhanced conversation stage determination
    determineConversationStage(messageCount, allUserText, currentContext) {
        // Stage 1: Initial greeting/introduction (0-2 messages)
        if (messageCount <= 2) return 1;
        
        // Stage 2: Business discovery (3-5 messages)
        if (messageCount <= 5 && !this.hasBusinessInfo(currentContext)) return 2;
        
        // Stage 3: Challenge identification (6-8 messages)
        if (messageCount <= 8 && !this.hasChallenges(currentContext)) return 3;
        
        // Stage 4: Vision exploration (9-12 messages)
        if (messageCount <= 12 && !this.hasGoals(currentContext)) return 4;
        
        // Stage 5: Solution discussion (13-15 messages)
        if (messageCount <= 15 && !this.hasServiceInterest(currentContext)) return 5;
        
        // Stage 6: Service recommendation (16-20 messages)
        if (messageCount <= 20 && !currentContext.pricingDiscussed) return 6;
        
        // Stage 7: Pricing discussion (21+ messages)
        return 7;
    }
    
    // Enhanced context extraction with better pattern matching
    extractConversationContext(conversationHistory, currentContext) {
        const userMessages = conversationHistory.filter(msg => msg.role === 'user');
        const allUserText = userMessages.map(msg => msg.content.toLowerCase()).join(' ');
        const recentText = userMessages.slice(-3).map(msg => msg.content.toLowerCase()).join(' ');
        
        const context = { ...currentContext };
        
        // Extract business information with enhanced patterns
        context.businessInfo = this.extractBusinessInfo(allUserText, context.businessInfo || {});
        
        // Extract challenges with improved detection
        context.challenges = this.extractChallenges(allUserText, context.challenges || []);
        
        // Extract goals with enhanced patterns
        context.goals = this.extractGoals(allUserText, context.goals || []);
        
        // Extract service interests with better matching
        context.servicesInterest = this.extractServiceInterests(allUserText, context.servicesInterest || []);
        
        // Extract urgency indicators
        context.urgency = this.extractUrgency(recentText);
        
        // Extract budget indicators
        context.budgetIndicators = this.extractBudgetIndicators(allUserText);
        
        // Extract contact readiness
        context.contactReadiness = this.assessContactReadiness(allUserText, context);
        
        return context;
    }
    
    // Enhanced business information extraction
    extractBusinessInfo(text, currentInfo = {}) {
        const businessInfo = { ...currentInfo };
        
        // Business type detection with more patterns
        const businessTypes = [
            { patterns: ['startup', 'new business', 'just starting', 'launching'], type: 'startup' },
            { patterns: ['established', 'existing business', 'been running', 'years in business'], type: 'established' },
            { patterns: ['freelancer', 'freelance', 'independent', 'solo'], type: 'freelancer' },
            { patterns: ['non-profit', 'nonprofit', 'charity', 'organization'], type: 'non-profit' }
        ];
        
        businessTypes.forEach(({ patterns, type }) => {
            if (patterns.some(pattern => text.includes(pattern))) {
                businessInfo.type = type;
            }
        });
        
        // Business size detection
        const sizeIndicators = [
            { patterns: ['small business', 'small company', 'just me', 'solo'], size: 'small' },
            { patterns: ['medium', 'growing', 'team of', 'several employees'], size: 'medium' },
            { patterns: ['large', 'enterprise', 'corporation', 'hundreds of'], size: 'large' }
        ];
        
        sizeIndicators.forEach(({ patterns, size }) => {
            if (patterns.some(pattern => text.includes(pattern))) {
                businessInfo.size = size;
            }
        });
        
        // Enhanced industry detection
        const industries = [
            'restaurant', 'retail', 'consulting', 'healthcare', 'education', 'real estate',
            'technology', 'finance', 'legal', 'construction', 'automotive', 'beauty',
            'fitness', 'travel', 'photography', 'marketing', 'accounting', 'insurance'
        ];
        
        industries.forEach(industry => {
            if (text.includes(industry)) {
                businessInfo.industry = industry;
            }
        });
        
        return businessInfo;
    }
    
    // Enhanced challenge extraction
    extractChallenges(text, currentChallenges = []) {
        const challenges = [...currentChallenges];
        
        const challengePatterns = [
            { pattern: /no website|don't have website|need website|without website/i, challenge: 'No online presence' },
            { pattern: /low sales|poor sales|not selling|sales down|struggling with sales/i, challenge: 'Low sales' },
            { pattern: /competitors|competition|competitive|losing to/i, challenge: 'Strong competition' },
            { pattern: /marketing|advertising|promotion|visibility|exposure/i, challenge: 'Marketing difficulties' },
            { pattern: /customers|clients|reach people|find customers|customer acquisition/i, challenge: 'Customer acquisition' },
            { pattern: /old website|outdated|redesign|website looks old|site needs update/i, challenge: 'Outdated website' },
            { pattern: /mobile|responsive|phone|not mobile friendly/i, challenge: 'Mobile optimization' },
            { pattern: /budget|expensive|cost|afford|cheap|price/i, challenge: 'Budget constraints' },
            { pattern: /time|busy|no time|rushed|urgent|deadline/i, challenge: 'Time constraints' },
            { pattern: /online|digital|internet|web presence/i, challenge: 'Digital presence' },
            { pattern: /social media|facebook|instagram|twitter|linkedin/i, challenge: 'Social media presence' }
        ];
        
        challengePatterns.forEach(({ pattern, challenge }) => {
            if (pattern.test(text) && !challenges.includes(challenge)) {
                challenges.push(challenge);
            }
        });
        
        return challenges;
    }
    
    // Enhanced goal extraction
    extractGoals(text, currentGoals = []) {
        const goals = [...currentGoals];
        
        const goalPatterns = [
            { pattern: /grow|increase|expand|scale|bigger|more/i, goal: 'Business growth' },
            { pattern: /online presence|web presence|digital|internet visibility/i, goal: 'Online presence' },
            { pattern: /more customers|more clients|attract|find customers|customer base/i, goal: 'Customer acquisition' },
            { pattern: /sales|revenue|profit|income|earnings|make money/i, goal: 'Increase sales' },
            { pattern: /brand|branding|identity|recognition|reputation/i, goal: 'Brand development' },
            { pattern: /professional|credible|trust|legitimate|serious/i, goal: 'Professional image' },
            { pattern: /automate|efficiency|streamline|easier|save time/i, goal: 'Process automation' },
            { pattern: /launch|start|begin|kick off|get going/i, goal: 'Business launch' },
            { pattern: /modernize|update|refresh|contemporary|current/i, goal: 'Modernization' }
        ];
        
        goalPatterns.forEach(({ pattern, goal }) => {
            if (pattern.test(text) && !goals.includes(goal)) {
                goals.push(goal);
            }
        });
        
        return goals;
    }
    
    // Enhanced service interest extraction
    extractServiceInterests(text, currentInterests = []) {
        const interests = [...currentInterests];
        
        const servicePatterns = [
            { pattern: /website|web site|web development|web design/i, service: 'Website Development' },
            { pattern: /logo|design|graphic design|visual identity/i, service: 'Logo Design' },
            { pattern: /ecommerce|online store|shop|sell online|e-commerce/i, service: 'E-commerce' },
            { pattern: /marketing|advertising|promotion|brochure|flyer/i, service: 'Marketing Materials' },
            { pattern: /brand|branding|brand identity|brand design/i, service: 'Brand Identity' },
            { pattern: /mobile|app|mobile app|application/i, service: 'Mobile Development' },
            { pattern: /seo|search engine|google|ranking|optimization/i, service: 'SEO Services' },
            { pattern: /social media|facebook|instagram|twitter|linkedin/i, service: 'Social Media' },
            { pattern: /business card|cards|stationery|letterhead/i, service: 'Business Cards' },
            { pattern: /hosting|domain|email|technical support/i, service: 'Technical Support' }
        ];
        
        servicePatterns.forEach(({ pattern, service }) => {
            if (pattern.test(text) && !interests.includes(service)) {
                interests.push(service);
            }
        });
        
        return interests;
    }
    
    // Extract urgency indicators
    extractUrgency(text) {
        const urgencyPatterns = [
            { pattern: /urgent|asap|immediately|rush|quick|fast|soon/i, level: 'high' },
            { pattern: /deadline|due|launch date|need by|within/i, level: 'medium' },
            { pattern: /eventually|when possible|no rush|flexible/i, level: 'low' }
        ];
        
        for (const { pattern, level } of urgencyPatterns) {
            if (pattern.test(text)) {
                return level;
            }
        }
        
        return 'medium'; // default
    }
    
    // Extract budget indicators
    extractBudgetIndicators(text) {
        const budgetPatterns = [
            { pattern: /budget|cost|price|expensive|cheap|afford/i, mentioned: true },
            { pattern: /\$\d+|dollar|thousand|hundred/i, specific: true },
            { pattern: /tight budget|limited budget|small budget/i, constraint: true },
            { pattern: /premium|high quality|best|top/i, quality: true }
        ];
        
        const indicators = {};
        
        budgetPatterns.forEach(({ pattern, ...props }) => {
            if (pattern.test(text)) {
                Object.assign(indicators, props);
            }
        });
        
        return indicators;
    }
    
    // Assess contact readiness
    assessContactReadiness(text, context) {
        let readiness = 0;
        
        // Positive indicators
        if (text.includes('call') || text.includes('talk') || text.includes('discuss')) readiness += 3;
        if (text.includes('quote') || text.includes('estimate') || text.includes('price')) readiness += 2;
        if (text.includes('ready') || text.includes('let\'s start') || text.includes('go ahead')) readiness += 3;
        if (text.includes('contact') || text.includes('reach out') || text.includes('get in touch')) readiness += 2;
        
        // Context factors
        if (context.challenges && context.challenges.length > 2) readiness += 1;
        if (context.goals && context.goals.length > 1) readiness += 1;
        if (context.servicesInterest && context.servicesInterest.length > 0) readiness += 1;
        
        return Math.min(readiness, 10);
    }
    
    // Generate conversation insights for AI models
    generateConversationInsights(context, stage, qualityScore) {
        const insights = {
            businessMaturity: this.assessBusinessMaturity(context),
            decisionMaker: this.assessDecisionMaker(context),
            projectScope: this.assessProjectScope(context),
            timeline: this.assessTimeline(context),
            budgetReadiness: this.assessBudgetReadiness(context),
            conversationFlow: this.assessConversationFlow(stage, qualityScore)
        };
        
        return insights;
    }
    
    // Determine next best actions
    determineNextActions(stage, context, qualityScore) {
        const actions = [];
        
        switch (stage) {
            case 1:
                actions.push('Ask about their business', 'Identify primary need');
                break;
            case 2:
                actions.push('Explore business challenges', 'Understand current situation');
                break;
            case 3:
                actions.push('Discuss business goals', 'Identify desired outcomes');
                break;
            case 4:
                actions.push('Suggest relevant services', 'Align solutions with goals');
                break;
            case 5:
                actions.push('Provide service details', 'Discuss implementation');
                break;
            case 6:
                actions.push('Present pricing options', 'Discuss timeline');
                break;
            case 7:
                actions.push('Finalize details', 'Prepare for handoff');
                break;
        }
        
        // Add quality-based actions
        if (qualityScore < 50) {
            actions.push('Deepen conversation', 'Ask clarifying questions');
        }
        
        // Add context-based actions
        if (context.contactReadiness >= 7) {
            actions.push('Offer consultation call', 'Prepare quote');
        }
        
        return actions;
    }
    
    // Enhanced quality score calculation
    calculateQualityScore(conversationHistory, context) {
        let score = 0;
        
        // Message depth and engagement (40 points)
        const messageCount = conversationHistory.filter(msg => msg.role === 'user').length;
        score += Math.min(messageCount * 2, 20);
        
        // Message length/detail (20 points)
        const avgMessageLength = conversationHistory
            .filter(msg => msg.role === 'user')
            .reduce((sum, msg) => sum + msg.content.length, 0) / messageCount;
        score += Math.min(avgMessageLength / 10, 20);
        
        // Context richness (40 points)
        if (context.businessInfo && Object.keys(context.businessInfo).length > 0) score += 10;
        if (context.challenges && context.challenges.length > 0) score += 10;
        if (context.goals && context.goals.length > 0) score += 10;
        if (context.servicesInterest && context.servicesInterest.length > 0) score += 10;
        
        return Math.min(score, 100);
    }
    
    // Enhanced lead score calculation
    calculateLeadScore(context, stage) {
        let score = 0;
        
        // Stage progression (30 points)
        score += stage * 4;
        
        // Business information completeness (25 points)
        if (context.businessInfo) {
            score += Math.min(Object.keys(context.businessInfo).length * 5, 25);
        }
        
        // Challenge identification (20 points)
        if (context.challenges) {
            score += Math.min(context.challenges.length * 4, 20);
        }
        
        // Goal alignment (15 points)
        if (context.goals) {
            score += Math.min(context.goals.length * 3, 15);
        }
        
        // Contact readiness (10 points)
        if (context.contactReadiness) {
            score += Math.min(context.contactReadiness, 10);
        }
        
        return Math.min(score, 100);
    }
    
    // Enhanced service suggestions
    suggestServices(context, allUserText) {
        const suggestions = [];
        const priorities = {};
        
        // Website suggestions with priority
        if (allUserText.includes('website') || allUserText.includes('web')) {
            if (context.businessInfo && context.businessInfo.type === 'startup') {
                suggestions.push('Basic Website');
                priorities['Basic Website'] = 8;
            } else {
                suggestions.push('Business Website');
                priorities['Business Website'] = 9;
            }
        }
        
        // E-commerce suggestions
        if (allUserText.includes('sell') || allUserText.includes('products') || allUserText.includes('store')) {
            suggestions.push('E-commerce Website');
            priorities['E-commerce Website'] = 10;
        }
        
        // Design suggestions
        if (allUserText.includes('logo') || allUserText.includes('design') || allUserText.includes('brand')) {
            suggestions.push('Logo Design');
            suggestions.push('Brand Identity');
            priorities['Logo Design'] = 7;
            priorities['Brand Identity'] = 8;
        }
        
        // Marketing suggestions
        if (allUserText.includes('marketing') || allUserText.includes('advertising')) {
            suggestions.push('Marketing Materials');
            priorities['Marketing Materials'] = 6;
        }
        
        // Sort by priority
        return suggestions.sort((a, b) => (priorities[b] || 0) - (priorities[a] || 0));
    }
    
    // Helper methods for context assessment
    hasBusinessInfo(context) {
        return context.businessInfo && Object.keys(context.businessInfo).length > 0;
    }
    
    hasChallenges(context) {
        return context.challenges && context.challenges.length > 0;
    }
    
    hasGoals(context) {
        return context.goals && context.goals.length > 0;
    }
    
    hasServiceInterest(context) {
        return context.servicesInterest && context.servicesInterest.length > 0;
    }
    
    // Assessment methods for insights
    assessBusinessMaturity(context) {
        if (!context.businessInfo) return 'unknown';
        if (context.businessInfo.type === 'startup') return 'startup';
        if (context.businessInfo.type === 'established') return 'established';
        return 'developing';
    }
    
    assessDecisionMaker(context) {
        // Logic to determine if user is likely the decision maker
        // This could be enhanced with ML in the future
        return 'likely'; // placeholder
    }
    
    assessProjectScope(context) {
        if (!context.servicesInterest || context.servicesInterest.length === 0) return 'undefined';
        if (context.servicesInterest.length === 1) return 'focused';
        if (context.servicesInterest.length <= 3) return 'moderate';
        return 'comprehensive';
    }
    
    assessTimeline(context) {
        if (!context.urgency) return 'flexible';
        return context.urgency;
    }
    
    assessBudgetReadiness(context) {
        if (!context.budgetIndicators) return 'unknown';
        if (context.budgetIndicators.constraint) return 'constrained';
        if (context.budgetIndicators.quality) return 'quality-focused';
        if (context.budgetIndicators.specific) return 'defined';
        return 'exploring';
    }
    
    assessConversationFlow(stage, qualityScore) {
        if (qualityScore >= 80) return 'excellent';
        if (qualityScore >= 60) return 'good';
        if (qualityScore >= 40) return 'developing';
        return 'needs-improvement';
    }
    
    // Fallback analysis for error cases
    getFallbackAnalysis(conversationHistory, currentContext) {
        const messageCount = conversationHistory.filter(msg => msg.role === 'user').length;
        
        return {
            stage: Math.min(Math.floor(messageCount / 3) + 1, 7),
            context: currentContext || {},
            qualityScore: 50,
            leadScore: 40,
            suggestedServices: ['Website Development'],
            conversationInsights: {
                businessMaturity: 'unknown',
                decisionMaker: 'unknown',
                projectScope: 'undefined',
                timeline: 'flexible',
                budgetReadiness: 'unknown',
                conversationFlow: 'fallback'
            },
            nextActions: ['Continue conversation', 'Gather more information'],
            analysisMetadata: {
                messageCount,
                analysisTime: 0,
                cacheUsed: false,
                fallback: true,
                timestamp: new Date().toISOString()
            }
        };
    }
    
    // Cache management
    generateCacheKey(conversationHistory, currentContext) {
        const historyHash = conversationHistory.map(msg => msg.content).join('').length;
        const contextHash = JSON.stringify(currentContext).length;
        return `conv_${historyHash}_${contextHash}`;
    }
    
    clearCache() {
        this.conversationCache.clear();
        this.cacheHits = 0;
        this.cacheMisses = 0;
    }
    
    // Performance tracking
    updatePerformanceMetrics(result, analysisTime) {
        this.performanceMetrics.totalAnalyses++;
        this.performanceMetrics.averageAnalysisTime = 
            (this.performanceMetrics.averageAnalysisTime * (this.performanceMetrics.totalAnalyses - 1) + analysisTime) / 
            this.performanceMetrics.totalAnalyses;
        
        // Track stage distribution
        const stage = result.stage;
        this.performanceMetrics.stageDistribution[stage] = 
            (this.performanceMetrics.stageDistribution[stage] || 0) + 1;
    }
    
    updateCacheHitRate() {
        const total = this.cacheHits + this.cacheMisses;
        this.performanceMetrics.cacheHitRate = total > 0 ? (this.cacheHits / total) * 100 : 0;
    }
    
    // Get performance statistics
    getPerformanceStats() {
        return {
            ...this.performanceMetrics,
            cacheStats: {
                hits: this.cacheHits,
                misses: this.cacheMisses,
                hitRate: this.performanceMetrics.cacheHitRate
            }
        };
    }
    
    // Reset performance metrics
    resetPerformanceMetrics() {
        this.performanceMetrics = {
            totalAnalyses: 0,
            averageAnalysisTime: 0,
            stageDistribution: {},
            errorCount: 0,
            cacheHitRate: 0
        };
        this.cacheHits = 0;
        this.cacheMisses = 0;
    }
}

module.exports = new ConversationManager();