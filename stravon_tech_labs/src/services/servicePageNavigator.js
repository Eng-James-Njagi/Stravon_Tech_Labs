const servicePageNavigator = {
    // Enhanced service page mapping with AI-optimized features
    servicePages: {
        basicWebsite: {
            id: "#basic-website-section",
            title: "Basic Website",
            description: "Perfect for small businesses getting started online",
            keywords: ["basic", "simple", "startup", "small business", "affordable", "beginner", "launch"],
            category: "website",
            priority: 1,
            targetBusinessType: ["startup", "small", "new"],
            estimatedTime: "2-3 weeks",
            startingPrice: "$1,500"
        },
        businessWebsite: {
            id: "#business-website-section", 
            title: "Business Website",
            description: "Professional websites for established businesses",
            keywords: ["business", "professional", "corporate", "company", "established", "growth"],
            category: "website",
            priority: 2,
            targetBusinessType: ["established", "medium", "growing"],
            estimatedTime: "3-4 weeks",
            startingPrice: "$2,500"
        },
        ecommerce: {
            id: "#ecommerce-section",
            title: "E-commerce Website",
            description: "Full-featured online stores",
            keywords: ["ecommerce", "online store", "shop", "selling", "products", "inventory", "payments", "cart"],
            category: "website",
            priority: 3,
            targetBusinessType: ["retail", "product-based", "established"],
            estimatedTime: "4-6 weeks",
            startingPrice: "$3,500"
        },
        premiumSolutions: {
            id: "#premium-solutions-section",
            title: "Premium Solutions",
            description: "Custom web applications and enterprise solutions",
            keywords: ["custom", "premium", "enterprise", "advanced", "complex", "application", "system"],
            category: "website",
            priority: 4,
            targetBusinessType: ["enterprise", "large", "complex"],
            estimatedTime: "6-12 weeks",
            startingPrice: "$5,000"
        },
        logoDesign: {
            id: "#logo-design-section",
            title: "Logo Design",
            description: "Professional logo design services",
            keywords: ["logo", "branding", "identity", "design", "brand mark", "visual identity"],
            category: "design",
            priority: 1,
            targetBusinessType: ["all"],
            estimatedTime: "1-2 weeks",
            startingPrice: "$500"
        },
        brandIdentity: {
            id: "#brand-identity-section",
            title: "Brand Identity",
            description: "Complete brand identity packages",
            keywords: ["brand", "identity", "branding", "complete package", "guidelines", "style guide"],
            category: "design",
            priority: 2,
            targetBusinessType: ["established", "growing"],
            estimatedTime: "2-3 weeks",
            startingPrice: "$1,200"
        },
        marketingMaterials: {
            id: "#marketing-materials-section",
            title: "Marketing Materials",
            description: "Print and digital marketing materials",
            keywords: ["marketing", "materials", "brochures", "flyers", "graphics", "promotional", "advertising"],
            category: "marketing",
            priority: 1,
            targetBusinessType: ["all"],
            estimatedTime: "1-2 weeks",
            startingPrice: "$300"
        }
    },

    // Performance tracking and caching
    cache: {
        serviceRecommendations: new Map(),
        detectionResults: new Map(),
        lastClearTime: Date.now()
    },

    metrics: {
        detectionRequests: 0,
        recommendationRequests: 0,
        cacheHits: 0,
        cacheMisses: 0,
        errorCount: 0,
        averageProcessingTime: 0,
        totalProcessingTime: 0,
        resetTime: Date.now()
    },

    // Enhanced service interest detection with scoring
    detectServiceInterest: function(conversationHistory) {
        const startTime = Date.now();
        this.metrics.detectionRequests++;

        try {
            // Create cache key
            const cacheKey = this.generateCacheKey(conversationHistory, 'detection');
            
            // Check cache first
            if (this.cache.detectionResults.has(cacheKey)) {
                this.metrics.cacheHits++;
                return this.cache.detectionResults.get(cacheKey);
            }

            this.metrics.cacheMisses++;

            const allText = conversationHistory
                .filter(msg => msg.role === 'user')
                .map(msg => msg.content.toLowerCase())
                .join(' ');

            const detectedServices = [];

            // Enhanced keyword matching with context scoring
            Object.entries(this.servicePages).forEach(([serviceKey, serviceInfo]) => {
                const keywordMatches = serviceInfo.keywords.filter(keyword => 
                    allText.includes(keyword)
                );
                
                if (keywordMatches.length > 0) {
                    // Calculate enhanced confidence score
                    const baseConfidence = keywordMatches.length / serviceInfo.keywords.length;
                    const contextBonus = this.calculateContextBonus(allText, serviceInfo);
                    const recencyBonus = this.calculateRecencyBonus(conversationHistory, serviceInfo.keywords);
                    
                    const confidence = Math.min(1.0, baseConfidence + contextBonus + recencyBonus);

                    detectedServices.push({
                        service: serviceKey,
                        confidence: confidence,
                        matchedKeywords: keywordMatches,
                        serviceInfo: serviceInfo,
                        category: serviceInfo.category,
                        priority: serviceInfo.priority,
                        contextScore: contextBonus,
                        recencyScore: recencyBonus
                    });
                }
            });

            // Sort by confidence, then by priority
            const sortedServices = detectedServices.sort((a, b) => {
                if (Math.abs(a.confidence - b.confidence) < 0.1) {
                    return a.priority - b.priority;
                }
                return b.confidence - a.confidence;
            });

            // Cache the result
            this.cache.detectionResults.set(cacheKey, sortedServices);
            
            // Update metrics
            const processingTime = Date.now() - startTime;
            this.updateProcessingMetrics(processingTime);

            return sortedServices;

        } catch (error) {
            this.metrics.errorCount++;
            console.error('Service detection error:', error);
            return [];
        }
    },

    // Calculate context bonus based on business type and conversation flow
    calculateContextBonus: function(allText, serviceInfo) {
        let bonus = 0;

        // Business type matching
        const businessTypeIndicators = {
            startup: ['startup', 'new business', 'launching', 'beginning'],
            established: ['established', 'existing', 'growing', 'expanding'],
            enterprise: ['enterprise', 'large', 'corporation', 'organization']
        };

        Object.entries(businessTypeIndicators).forEach(([type, indicators]) => {
            if (indicators.some(indicator => allText.includes(indicator))) {
                if (serviceInfo.targetBusinessType.includes(type) || serviceInfo.targetBusinessType.includes('all')) {
                    bonus += 0.15;
                }
            }
        });

        // Urgency indicators
        const urgencyIndicators = ['urgent', 'quickly', 'asap', 'rush', 'deadline'];
        if (urgencyIndicators.some(indicator => allText.includes(indicator))) {
            bonus += 0.1;
        }

        // Budget indicators
        const budgetIndicators = ['budget', 'cost', 'price', 'affordable', 'expensive'];
        if (budgetIndicators.some(indicator => allText.includes(indicator))) {
            bonus += 0.05;
        }

        return bonus;
    },

    // Calculate recency bonus for recent mentions
    calculateRecencyBonus: function(conversationHistory, keywords) {
        const recentMessages = conversationHistory.slice(-3); // Last 3 messages
        const recentText = recentMessages
            .filter(msg => msg.role === 'user')
            .map(msg => msg.content.toLowerCase())
            .join(' ');

        const recentMatches = keywords.filter(keyword => recentText.includes(keyword));
        return recentMatches.length > 0 ? 0.1 : 0;
    },

    // Enhanced service page navigation with context
    getServicePageNavigation: function(serviceType, conversationContext = {}) {
        const service = this.servicePages[serviceType];
        if (!service) return null;

        const contextualMessage = this.generateContextualMessage(service, conversationContext);

        return {
            pageId: service.id,
            title: service.title,
            description: service.description,
            navigationText: `Learn more about our ${service.title} services`,
            callToAction: `Click here to see our ${service.title} portfolio and details`,
            contextualMessage: contextualMessage,
            estimatedTime: service.estimatedTime,
            startingPrice: service.startingPrice,
            category: service.category
        };
    },

    // Generate contextual message based on conversation
    generateContextualMessage: function(service, conversationContext) {
        const { businessType, urgency, budget, goals } = conversationContext;

        let message = `Our ${service.title} service `;

        // Add business type context
        if (businessType && service.targetBusinessType.includes(businessType)) {
            message += `is perfect for ${businessType} businesses like yours. `;
        }

        // Add urgency context
        if (urgency === 'high') {
            message += `We can expedite this project to meet your timeline. `;
        }

        // Add budget context
        if (budget === 'limited') {
            message += `We offer flexible payment options to work within your budget. `;
        }

        // Add goals context
        if (goals && goals.includes('growth')) {
            message += `This solution is designed to support your business growth. `;
        }

        message += `Starting at ${service.startingPrice} with ${service.estimatedTime} timeline.`;

        return message;
    },

    // Enhanced service recommendations with AI optimization
    generateServiceRecommendations: function(conversationContext) {
        const startTime = Date.now();
        this.metrics.recommendationRequests++;

        try {
            // Create cache key
            const cacheKey = this.generateCacheKey(conversationContext, 'recommendations');
            
            // Check cache first
            if (this.cache.serviceRecommendations.has(cacheKey)) {
                this.metrics.cacheHits++;
                return this.cache.serviceRecommendations.get(cacheKey);
            }

            this.metrics.cacheMisses++;

            const recommendations = [];
            const businessInfo = conversationContext.businessInfo || {};
            const challenges = conversationContext.challenges || [];
            const goals = conversationContext.goals || [];
            const timeline = conversationContext.timeline || 'flexible';
            const budget = conversationContext.budget || 'flexible';

            // Enhanced business type analysis
            const businessTypeScore = this.analyzeBusinessType(businessInfo, conversationContext);
            
            // Website service recommendations
            if (businessTypeScore.startup > 0.7 || businessInfo.size === 'small') {
                recommendations.push({
                    service: 'basicWebsite',
                    reason: 'Perfect for small businesses getting started online',
                    priority: 'high',
                    confidence: 0.9,
                    category: 'website'
                });
            }

            if (businessTypeScore.established > 0.7 || businessInfo.size === 'medium') {
                recommendations.push({
                    service: 'businessWebsite',
                    reason: 'Professional solution for established businesses',
                    priority: 'high',
                    confidence: 0.85,
                    category: 'website'
                });
            }

            // E-commerce analysis
            const ecommerceScore = this.analyzeEcommerceNeed(conversationContext);
            if (ecommerceScore > 0.5) {
                recommendations.push({
                    service: 'ecommerce',
                    reason: 'Based on your need to sell products online',
                    priority: 'high',
                    confidence: ecommerceScore,
                    category: 'website'
                });
            }

            // Branding analysis
            const brandingScore = this.analyzeBrandingNeed(conversationContext);
            if (brandingScore > 0.4) {
                recommendations.push({
                    service: 'logoDesign',
                    reason: 'To establish your brand identity',
                    priority: 'medium',
                    confidence: brandingScore,
                    category: 'design'
                });
            }

            // Marketing analysis
            const marketingScore = this.analyzeMarketingNeed(conversationContext);
            if (marketingScore > 0.4) {
                recommendations.push({
                    service: 'marketingMaterials',
                    reason: 'To support your marketing efforts',
                    priority: 'medium',
                    confidence: marketingScore,
                    category: 'marketing'
                });
            }

            // Premium solutions analysis
            if (businessTypeScore.enterprise > 0.6 || businessInfo.size === 'large') {
                recommendations.push({
                    service: 'premiumSolutions',
                    reason: 'Custom solutions for complex business needs',
                    priority: 'high',
                    confidence: 0.8,
                    category: 'website'
                });
            }

            // Sort recommendations by priority and confidence
            const sortedRecommendations = recommendations.sort((a, b) => {
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
                
                if (priorityDiff !== 0) return priorityDiff;
                return b.confidence - a.confidence;
            });

            // Cache the result
            this.cache.serviceRecommendations.set(cacheKey, sortedRecommendations);
            
            // Update metrics
            const processingTime = Date.now() - startTime;
            this.updateProcessingMetrics(processingTime);

            return sortedRecommendations;

        } catch (error) {
            this.metrics.errorCount++;
            console.error('Service recommendation error:', error);
            return [];
        }
    },

    // Analyze business type from conversation context
    analyzeBusinessType: function(businessInfo, conversationContext) {
        const allText = JSON.stringify(conversationContext).toLowerCase();
        
        const scores = {
            startup: 0,
            established: 0,
            enterprise: 0
        };

        // Startup indicators
        const startupKeywords = ['startup', 'new business', 'launching', 'beginning', 'first time', 'small budget'];
        startupKeywords.forEach(keyword => {
            if (allText.includes(keyword)) scores.startup += 0.2;
        });

        // Established business indicators
        const establishedKeywords = ['established', 'existing', 'growing', 'expanding', 'current website', 'redesign'];
        establishedKeywords.forEach(keyword => {
            if (allText.includes(keyword)) scores.established += 0.2;
        });

        // Enterprise indicators
        const enterpriseKeywords = ['enterprise', 'large', 'corporation', 'organization', 'complex', 'custom'];
        enterpriseKeywords.forEach(keyword => {
            if (allText.includes(keyword)) scores.enterprise += 0.2;
        });

        return scores;
    },

    // Analyze e-commerce need
    analyzeEcommerceNeed: function(conversationContext) {
        const allText = JSON.stringify(conversationContext).toLowerCase();
        const ecommerceKeywords = ['sell', 'products', 'inventory', 'payments', 'online store', 'shop', 'cart', 'checkout'];
        
        let score = 0;
        ecommerceKeywords.forEach(keyword => {
            if (allText.includes(keyword)) score += 0.125;
        });

        return Math.min(1.0, score);
    },

    // Analyze branding need
    analyzeBrandingNeed: function(conversationContext) {
        const allText = JSON.stringify(conversationContext).toLowerCase();
        const brandingKeywords = ['brand', 'logo', 'identity', 'design', 'visual', 'branding'];
        
        let score = 0;
        brandingKeywords.forEach(keyword => {
            if (allText.includes(keyword)) score += 0.167;
        });

        return Math.min(1.0, score);
    },

    // Analyze marketing need
    analyzeMarketingNeed: function(conversationContext) {
        const allText = JSON.stringify(conversationContext).toLowerCase();
        const marketingKeywords = ['marketing', 'advertising', 'promotion', 'brochure', 'flyer', 'materials'];
        
        let score = 0;
        marketingKeywords.forEach(keyword => {
            if (allText.includes(keyword)) score += 0.167;
        });

        return Math.min(1.0, score);
    },

    // Enhanced service recommendations formatting
    formatServiceRecommendations: function(recommendations, conversationContext = {}) {
        if (recommendations.length === 0) return '';

        const { businessType, urgency, timeline } = conversationContext;
        
        let intro = 'Based on our conversation, here are some services that might be perfect for you:\n\n';
        
        // Add contextual intro
        if (businessType) {
            intro = `As a ${businessType} business, here are the services that would work best for you:\n\n`;
        }

        const formatted = recommendations.map((rec, index) => {
            const service = this.servicePages[rec.service];
            const confidenceIndicator = rec.confidence > 0.8 ? '🎯' : rec.confidence > 0.6 ? '✨' : '💡';
            
            return `${confidenceIndicator} **${service.title}** - ${rec.reason}${service.estimatedTime ? ` (${service.estimatedTime})` : ''}`;
        });

        let outro = '\nWould you like to learn more about any of these services?';
        
        // Add urgency-based outro
        if (urgency === 'high') {
            outro = '\nGiven your timeline, I can prioritize these recommendations. Which service interests you most?';
        }

        return `${intro}${formatted.join('\n')}${outro}`;
    },

    // Enhanced service page link with context
    getServicePageLink: function(serviceType, context = '', conversationContext = {}) {
        const service = this.servicePages[serviceType];
        if (!service) return null;

        const contextualMessage = context || this.generateContextualMessage(service, conversationContext);

        return {
            pageId: service.id,
            linkText: `Learn more about ${service.title}`,
            contextualMessage: contextualMessage,
            category: service.category,
            estimatedTime: service.estimatedTime,
            startingPrice: service.startingPrice
        };
    },

    // Enhanced readiness check for service page navigation
    isReadyForServiceNavigation: function(conversationStage, conversationContext) {
        // Enhanced readiness criteria
        const hasServiceInterest = conversationContext.servicesInterest && conversationContext.servicesInterest.length > 0;
        const hasChallenges = conversationContext.challenges && conversationContext.challenges.length > 0;
        const hasGoals = conversationContext.goals && conversationContext.goals.length > 0;
        const hasBusinessInfo = conversationContext.businessInfo && Object.keys(conversationContext.businessInfo).length > 0;
        
        // Calculate readiness score
        let readinessScore = 0;
        
        if (conversationStage >= 3) readinessScore += 0.4;
        if (hasServiceInterest) readinessScore += 0.2;
        if (hasChallenges) readinessScore += 0.15;
        if (hasGoals) readinessScore += 0.15;
        if (hasBusinessInfo) readinessScore += 0.1;
        
        return readinessScore >= 0.6;
    },

    // Service categories for better organization
    getServicesByCategory: function(category) {
        return Object.entries(this.servicePages)
            .filter(([key, service]) => service.category === category)
            .map(([key, service]) => ({ key, ...service }));
    },

    // Get all available categories
    getCategories: function() {
        const categories = [...new Set(Object.values(this.servicePages).map(service => service.category))];
        return categories.sort();
    },

    // Utility functions for caching and performance
    generateCacheKey: function(data, type) {
        const dataString = JSON.stringify(data);
        return `${type}_${Buffer.from(dataString).toString('base64').substr(0, 32)}`;
    },

    updateProcessingMetrics: function(processingTime) {
        this.metrics.totalProcessingTime += processingTime;
        this.metrics.averageProcessingTime = this.metrics.totalProcessingTime / 
            (this.metrics.detectionRequests + this.metrics.recommendationRequests);
    },

    // Cache management
    clearCache: function() {
        this.cache.serviceRecommendations.clear();
        this.cache.detectionResults.clear();
        this.cache.lastClearTime = Date.now();
    },

    // Performance monitoring
    getPerformanceMetrics: function() {
        const totalRequests = this.metrics.detectionRequests + this.metrics.recommendationRequests;
        const cacheHitRate = totalRequests > 0 ? (this.metrics.cacheHits / totalRequests) * 100 : 0;
        const errorRate = totalRequests > 0 ? (this.metrics.errorCount / totalRequests) * 100 : 0;

        return {
            totalRequests: totalRequests,
            detectionRequests: this.metrics.detectionRequests,
            recommendationRequests: this.metrics.recommendationRequests,
            cacheHitRate: cacheHitRate.toFixed(2) + '%',
            errorRate: errorRate.toFixed(2) + '%',
            averageProcessingTime: this.metrics.averageProcessingTime.toFixed(2) + 'ms',
            uptime: ((Date.now() - this.metrics.resetTime) / 1000 / 60).toFixed(2) + ' minutes'
        };
    },

    // Reset metrics (useful for monitoring)
    resetMetrics: function() {
        this.metrics = {
            detectionRequests: 0,
            recommendationRequests: 0,
            cacheHits: 0,
            cacheMisses: 0,
            errorCount: 0,
            averageProcessingTime: 0,
            totalProcessingTime: 0,
            resetTime: Date.now()
        };
    }
};

module.exports = servicePageNavigator;