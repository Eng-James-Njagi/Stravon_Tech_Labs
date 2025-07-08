class PricingService {
    constructor() {
        this.strictPricing = {
            basicWebsite: {
                range: "KES 8,000 - 15,000",
                includes: ["responsive design", "contact forms", "basic SEO"],
                servicePageId: "#basic-website-section",
                exactResponse: "At Stravon Tech Labs, we offer basic websites starting from KES 8,000 to 15,000. This includes responsive design, contact forms, and basic SEO. Perfect for small businesses getting started online.",
                priority: 1,
                category: "website"
            },
            
            businessWebsite: {
                range: "KES 15,000 - 30,000",
                includes: ["professional design", "CMS", "social media integration", "advanced SEO"],
                servicePageId: "#business-website-section",
                exactResponse: "Our business websites at Stravon range from KES 15,000 to 30,000. This includes professional design, content management system, social media integration, and advanced SEO.",
                priority: 2,
                category: "website"
            },
            
            ecommerce: {
                range: "KES 25,000 - 50,000",
                includes: ["online store setup", "payment gateway", "inventory management", "mobile optimization"],
                servicePageId: "#ecommerce-section",
                exactResponse: "At Stravon Tech Labs, our e-commerce solutions start from KES 25,000 to 50,000. This includes online store setup, payment gateway integration, inventory management, and mobile optimization.",
                priority: 3,
                category: "ecommerce"
            },
            
            premiumSolutions: {
                range: "KES 50,000 - 350,000",
                includes: ["custom web applications", "advanced features", "enterprise solutions"],
                servicePageId: "#premium-solutions-section",
                exactResponse: "Our premium solutions at Stravon range from KES 50,000 to 350,000, depending on complexity. This includes custom web applications, advanced e-commerce features, and enterprise solutions.",
                priority: 4,
                category: "premium"
            },
            
            logoDesign: {
                range: "KES 2,000 - 10,000",
                includes: ["multiple concepts", "unlimited revisions", "various file formats"],
                servicePageId: "#logo-design-section",
                exactResponse: "At Stravon Tech Labs, logo design services range from KES 2,000 to 10,000. This includes multiple concepts, unlimited revisions, and various file formats.",
                priority: 5,
                category: "design"
            },
            
            brandIdentity: {
                range: "KES 5,000 - 25,000",
                includes: ["logo", "color palette", "typography", "business cards", "brand guidelines"],
                servicePageId: "#brand-identity-section",
                exactResponse: "Our brand identity packages at Stravon start from KES 5,000 to 25,000. This includes logo, color palette, typography, business cards, and brand guidelines.",
                priority: 6,
                category: "design"
            },
            
            marketingMaterials: {
                range: "KES 1,000 - 15,000",
                includes: ["brochures", "flyers", "social media graphics", "digital advertisements"],
                servicePageId: "#marketing-materials-section",
                exactResponse: "At Stravon Tech Labs, marketing materials range from KES 1,000 to 15,000. This includes brochures, flyers, social media graphics, and digital advertisements.",
                priority: 7,
                category: "marketing"
            }
        };

        // Performance tracking
        this.performanceMetrics = {
            totalValidations: 0,
            correctionsApplied: 0,
            serviceIdentifications: 0,
            errorCount: 0,
            averageProcessingTime: 0
        };

        // Service recommendation cache
        this.recommendationCache = new Map();
        this.cacheHits = 0;
        this.cacheMisses = 0;
    }

    // Enhanced pricing validation with better error handling
    validatePricing(response, conversationStage = 6, options = {}) {
        const startTime = Date.now();
        
        try {
            this.performanceMetrics.totalValidations++;
            
            // Only validate pricing if conversation is ready (stage 6+)
            if (conversationStage < 6 && !options.forceValidation) {
                return response;
            }
            
            // Check if response contains any pricing information
            const pricingPatterns = [
                /KES\s*\d+/gi,
                /\d+\s*KES/gi,
                /\d+,\d+/gi,
                /\d+k/gi,
                /cost/gi,
                /price/gi,
                /budget/gi,
                /quote/gi,
                /estimate/gi
            ];

            let containsPricing = false;
            for (const pattern of pricingPatterns) {
                if (pattern.test(response)) {
                    containsPricing = true;
                    break;
                }
            }

            if (!containsPricing) {
                return response; // No pricing mentioned, return as is
            }

            // If pricing is mentioned, validate and correct it
            const correctedResponse = this.correctPricing(response);
            
            if (correctedResponse !== response) {
                this.performanceMetrics.correctionsApplied++;
            }
            
            this.updateProcessingTime(Date.now() - startTime);
            return correctedResponse;
            
        } catch (error) {
            this.performanceMetrics.errorCount++;
            console.error('PricingService Validation Error:', error);
            return response; // Return original response on error
        }
    }

    // Enhanced pricing correction with better pattern matching
    correctPricing(response) {
        let correctedResponse = response;
        
        // Define correction patterns and their replacements with enhanced matching
        const corrections = [
            {
                pattern: /(?:basic\s+website|simple\s+website|starter\s+website).*?(?:KES\s*)?(?:\d+,?\d*\s*(?:-|to)\s*)?(?:KES\s*)?\d+,?\d*/gi,
                replacement: this.strictPricing.basicWebsite.exactResponse,
                service: 'basicWebsite'
            },
            {
                pattern: /(?:business\s+website|professional\s+website|corporate\s+website).*?(?:KES\s*)?(?:\d+,?\d*\s*(?:-|to)\s*)?(?:KES\s*)?\d+,?\d*/gi,
                replacement: this.strictPricing.businessWebsite.exactResponse,
                service: 'businessWebsite'
            },
            {
                pattern: /(?:e-?commerce|online\s+store|shop|store).*?(?:KES\s*)?(?:\d+,?\d*\s*(?:-|to)\s*)?(?:KES\s*)?\d+,?\d*/gi,
                replacement: this.strictPricing.ecommerce.exactResponse,
                service: 'ecommerce'
            },
            {
                pattern: /(?:premium\s+solutions|custom\s+solutions|advanced\s+solutions|enterprise).*?(?:KES\s*)?(?:\d+,?\d*\s*(?:-|to)\s*)?(?:KES\s*)?\d+,?\d*/gi,
                replacement: this.strictPricing.premiumSolutions.exactResponse,
                service: 'premiumSolutions'
            },
            {
                pattern: /(?:logo\s+design|logo\s+creation|company\s+logo).*?(?:KES\s*)?(?:\d+,?\d*\s*(?:-|to)\s*)?(?:KES\s*)?\d+,?\d*/gi,
                replacement: this.strictPricing.logoDesign.exactResponse,
                service: 'logoDesign'
            },
            {
                pattern: /(?:brand\s+identity|branding\s+package|visual\s+identity).*?(?:KES\s*)?(?:\d+,?\d*\s*(?:-|to)\s*)?(?:KES\s*)?\d+,?\d*/gi,
                replacement: this.strictPricing.brandIdentity.exactResponse,
                service: 'brandIdentity'
            },
            {
                pattern: /(?:marketing\s+materials|promotional\s+materials|print\s+materials).*?(?:KES\s*)?(?:\d+,?\d*\s*(?:-|to)\s*)?(?:KES\s*)?\d+,?\d*/gi,
                replacement: this.strictPricing.marketingMaterials.exactResponse,
                service: 'marketingMaterials'
            }
        ];

        // Apply corrections with tracking
        corrections.forEach(({ pattern, replacement, service }) => {
            if (pattern.test(correctedResponse)) {
                correctedResponse = correctedResponse.replace(pattern, replacement);
            }
        });

        return correctedResponse;
    }

    // Enhanced service identification with caching and improved logic
    identifyRelevantServices(userMessage, conversationHistory = [], conversationContext = {}) {
        const startTime = Date.now();
        
        try {
            this.performanceMetrics.serviceIdentifications++;
            
            // Generate cache key
            const cacheKey = this.generateServiceCacheKey(userMessage, conversationHistory);
            
            // Check cache
            if (this.recommendationCache.has(cacheKey)) {
                this.cacheHits++;
                return this.recommendationCache.get(cacheKey);
            }
            
            this.cacheMisses++;
            
            const message = userMessage.toLowerCase();
            const history = conversationHistory.map(msg => 
                typeof msg === 'string' ? msg : msg.content || ''
            ).join(' ').toLowerCase();
            const fullContext = `${history} ${message}`;
            
            const relevantServices = [];
            const serviceScores = {};
            
            // Enhanced service identification with scoring
            this.scoreWebsiteServices(fullContext, serviceScores, conversationContext);
            this.scoreDesignServices(fullContext, serviceScores, conversationContext);
            this.scoreMarketingServices(fullContext, serviceScores, conversationContext);
            
            // Convert scores to sorted service list
            const sortedServices = Object.entries(serviceScores)
                .sort(([,a], [,b]) => b - a)
                .filter(([,score]) => score > 0)
                .map(([service,]) => service);
            
            // Cache the result
            this.recommendationCache.set(cacheKey, sortedServices);
            
            this.updateProcessingTime(Date.now() - startTime);
            return sortedServices;
            
        } catch (error) {
            this.performanceMetrics.errorCount++;
            console.error('PricingService Service Identification Error:', error);
            return ['basicWebsite']; // Fallback to basic website
        }
    }

    // Enhanced website service scoring
    scoreWebsiteServices(text, scores, context = {}) {
        const websiteKeywords = ['website', 'web', 'site', 'online presence', 'web development', 'web design'];
        
        if (!websiteKeywords.some(keyword => text.includes(keyword))) {
            return; // No website interest
        }
        
        // Base website score
        let baseScore = 5;
        
        // E-commerce indicators
        const ecommerceKeywords = ['ecommerce', 'e-commerce', 'online store', 'shop', 'sell online', 'store', 'cart', 'payment', 'products', 'inventory'];
        const ecommerceScore = ecommerceKeywords.filter(keyword => text.includes(keyword)).length * 3;
        
        // Premium/custom indicators
        const premiumKeywords = ['custom', 'complex', 'advanced', 'enterprise', 'system', 'application', 'database', 'integration'];
        const premiumScore = premiumKeywords.filter(keyword => text.includes(keyword)).length * 4;
        
        // Business indicators
        const businessKeywords = ['business', 'professional', 'corporate', 'company', 'portfolio', 'services'];
        const businessScore = businessKeywords.filter(keyword => text.includes(keyword)).length * 2;
        
        // Context-based scoring
        if (context.businessInfo) {
            if (context.businessInfo.type === 'startup') baseScore += 2;
            if (context.businessInfo.type === 'established') baseScore += 3;
            if (context.businessInfo.size === 'large') baseScore += 4;
        }
        
        // Assign scores
        if (ecommerceScore > 6) {
            scores.ecommerce = baseScore + ecommerceScore;
        }
        
        if (premiumScore > 8) {
            scores.premiumSolutions = baseScore + premiumScore;
        }
        
        if (businessScore > 4 && !scores.ecommerce && !scores.premiumSolutions) {
            scores.businessWebsite = baseScore + businessScore;
        }
        
        // Default to basic website if no specific indicators
        if (!scores.ecommerce && !scores.premiumSolutions && !scores.businessWebsite) {
            scores.basicWebsite = baseScore;
        }
    }

    // Enhanced design service scoring
    scoreDesignServices(text, scores, context = {}) {
        const logoKeywords = ['logo', 'brand mark', 'identity mark', 'company logo', 'design logo'];
        const logoScore = logoKeywords.filter(keyword => text.includes(keyword)).length * 4;
        
        const brandKeywords = ['brand', 'branding', 'brand identity', 'visual identity', 'brand package', 'brand guidelines'];
        const brandScore = brandKeywords.filter(keyword => text.includes(keyword)).length * 3;
        
        // Context-based adjustments
        if (context.goals && context.goals.includes('Brand development')) {
            if (logoScore > 0) scores.logoDesign = logoScore + 3;
            if (brandScore > 0) scores.brandIdentity = brandScore + 4;
        } else {
            if (logoScore > 0) scores.logoDesign = logoScore;
            if (brandScore > 0) scores.brandIdentity = brandScore;
        }
    }

    // Enhanced marketing service scoring
    scoreMarketingServices(text, scores, context = {}) {
        const marketingKeywords = ['marketing', 'flyer', 'brochure', 'poster', 'banner', 'advertisement', 'promotional', 'print materials'];
        const marketingScore = marketingKeywords.filter(keyword => text.includes(keyword)).length * 3;
        
        // Context-based adjustments
        if (context.challenges && context.challenges.includes('Marketing difficulties')) {
            scores.marketingMaterials = marketingScore + 4;
        } else if (marketingScore > 0) {
            scores.marketingMaterials = marketingScore;
        }
    }

    // Enhanced keyword detection methods
    containsWebsiteKeywords(text) {
        const keywords = ['website', 'web', 'site', 'online presence', 'web development', 'web design', 'web page'];
        return keywords.some(keyword => text.includes(keyword));
    }

    containsEcommerceKeywords(text) {
        const keywords = ['ecommerce', 'e-commerce', 'online store', 'shop', 'sell online', 'store', 'cart', 'payment', 'checkout'];
        return keywords.some(keyword => text.includes(keyword));
    }

    containsComplexKeywords(text) {
        const keywords = ['custom', 'complex', 'advanced', 'enterprise', 'system', 'application', 'database', 'integration', 'api'];
        return keywords.some(keyword => text.includes(keyword));
    }

    containsBusinessKeywords(text) {
        const keywords = ['business', 'professional', 'corporate', 'company', 'portfolio', 'services', 'commercial'];
        return keywords.some(keyword => text.includes(keyword));
    }

    containsLogoKeywords(text) {
        const keywords = ['logo', 'brand mark', 'identity mark', 'company logo', 'design logo', 'logo design'];
        return keywords.some(keyword => text.includes(keyword));
    }

    containsBrandKeywords(text) {
        const keywords = ['brand', 'branding', 'brand identity', 'visual identity', 'brand package', 'brand guidelines'];
        return keywords.some(keyword => text.includes(keyword));
    }

    containsMarketingKeywords(text) {
        const keywords = ['marketing', 'flyer', 'brochure', 'poster', 'banner', 'advertisement', 'promotional', 'print materials'];
        return keywords.some(keyword => text.includes(keyword));
    }

    // Enhanced pricing retrieval with context awareness
    getPricingForService(serviceType, context = {}) {
        const service = this.strictPricing[serviceType];
        if (!service) return null;
        
        // Add context-aware pricing adjustments
        let adjustedResponse = service.exactResponse;
        
        // Add urgency-based messaging
        if (context.urgency === 'high') {
            adjustedResponse += " We can prioritize your project for faster delivery.";
        }
        
        // Add business-specific messaging
        if (context.businessInfo) {
            if (context.businessInfo.type === 'startup') {
                adjustedResponse += " Perfect for startups looking to establish their online presence.";
            } else if (context.businessInfo.type === 'established') {
                adjustedResponse += " Ideal for established businesses looking to enhance their digital presence.";
            }
        }
        
        return {
            range: service.range,
            includes: service.includes,
            servicePageId: service.servicePageId,
            response: adjustedResponse,
            priority: service.priority,
            category: service.category
        };
    }

    // Enhanced multi-service pricing
    getPricingForServices(services, context = {}) {
        const pricing = {};
        
        services.forEach(service => {
            const serviceData = this.getPricingForService(service, context);
            if (serviceData) {
                pricing[service] = serviceData;
            }
        });
        
        return pricing;
    }

    // Enhanced pricing timing logic
    shouldShowPricing(conversationStage, context = {}) {
        // Primary condition: stage 6+
        if (conversationStage >= 6) return true;
        
        // Secondary conditions: explicit pricing request or high contact readiness
        if (context.contactReadiness >= 8) return true;
        if (context.urgency === 'high') return true;
        
        return false;
    }

    // Enhanced pricing timing check
    checkPricingTiming(conversationHistory, context = {}) {
        const totalMessages = conversationHistory.length;
        const userMessages = conversationHistory.filter(msg => 
            (typeof msg === 'object' && msg.role === 'user') || typeof msg === 'string'
        ).length;
        
        // Need at least 3 exchanges before pricing
        if (userMessages < 3) return false;
        
        // Check explicit pricing request
        const lastUserMessage = conversationHistory[conversationHistory.length - 1];
        if (lastUserMessage) {
            const messageContent = typeof lastUserMessage === 'string' ? 
                lastUserMessage : lastUserMessage.content || '';
            const message = messageContent.toLowerCase();
            
            const pricingKeywords = [
                'cost', 'price', 'pricing', 'budget', 'how much', 'what does it cost',
                'quote', 'estimate', 'rates', 'fees', 'charges', 'investment'
            ];
            
            if (pricingKeywords.some(keyword => message.includes(keyword))) {
                return true;
            }
        }
        
        // Check context-based readiness
        if (context.contactReadiness >= 7) return true;
        if (context.qualityScore >= 70) return true;
        
        return false;
    }

    // Enhanced pricing response formatting
    formatPricingResponse(services, conversationContext = { stage: 6 }) {
        if (!this.shouldShowPricing(conversationContext.stage, conversationContext)) {
            return null; // Don't show pricing yet
        }

        const pricing = this.getPricingForServices(services, conversationContext);
        
        if (Object.keys(pricing).length === 0) {
            return null;
        }

        // Format based on context and service count
        if (Object.keys(pricing).length === 1) {
            const service = Object.keys(pricing)[0];
            return pricing[service].response;
        } else {
            // Multiple services - format with context awareness
            let response = this.generateMultiServiceIntro(conversationContext);
            
            // Sort services by priority
            const sortedServices = Object.entries(pricing)
                .sort(([,a], [,b]) => (a.priority || 999) - (b.priority || 999));
            
            sortedServices.forEach(([service, details]) => {
                response += `• ${details.response}\n`;
            });
            
            response += this.generateMultiServiceOutro(conversationContext);
            return response;
        }
    }

    // Generate context-aware intro for multi-service responses
    generateMultiServiceIntro(context) {
        if (context.businessInfo) {
            if (context.businessInfo.type === 'startup') {
                return "Based on your startup's needs, here's what would work perfectly:\n\n";
            } else if (context.businessInfo.type === 'established') {
                return "For an established business like yours, I'd recommend:\n\n";
            }
        }
        
        if (context.urgency === 'high') {
            return "Given your timeline, here are our recommended solutions:\n\n";
        }
        
        return "Based on what you've shared, here's what would work well for your business:\n\n";
    }

    // Generate context-aware outro for multi-service responses
    generateMultiServiceOutro(context) {
        if (context.contactReadiness >= 8) {
            return "\nI'd love to discuss these options with you in more detail. Would you like to schedule a quick call?";
        }
        
        if (context.urgency === 'high') {
            return "\nGiven your timeline, I can prioritize your project. Let me know which option interests you most!";
        }
        
        return "\nWhich of these options sounds most interesting for your business?";
    }

    // Enhanced service page navigation
    addServicePageNavigation(response, serviceType) {
        const service = this.strictPricing[serviceType];
        if (!service) return response;
        
        return `${response}\n\nYou can learn more about this service on our website by clicking [here](${service.servicePageId}).`;
    }

    // Cache management
    generateServiceCacheKey(userMessage, conversationHistory) {
        const historyHash = conversationHistory.map(msg => 
            typeof msg === 'string' ? msg : msg.content || ''
        ).join('').length;
        const messageHash = userMessage.length;
        return `service_${historyHash}_${messageHash}`;
    }

    clearServiceCache() {
        this.recommendationCache.clear();
        this.cacheHits = 0;
        this.cacheMisses = 0;
    }

    // Performance tracking
    updateProcessingTime(processingTime) {
        const totalOps = this.performanceMetrics.totalValidations + this.performanceMetrics.serviceIdentifications;
        this.performanceMetrics.averageProcessingTime = 
            (this.performanceMetrics.averageProcessingTime * (totalOps - 1) + processingTime) / totalOps;
    }

    // Get performance statistics
    getPerformanceStats() {
        return {
            ...this.performanceMetrics,
            cacheStats: {
                hits: this.cacheHits,
                misses: this.cacheMisses,
                hitRate: this.cacheHits + this.cacheMisses > 0 ? 
                    (this.cacheHits / (this.cacheHits + this.cacheMisses)) * 100 : 0
            }
        };
    }

    // Reset performance metrics
    resetPerformanceMetrics() {
        this.performanceMetrics = {
            totalValidations: 0,
            correctionsApplied: 0,
            serviceIdentifications: 0,
            errorCount: 0,
            averageProcessingTime: 0
        };
        this.cacheHits = 0;
        this.cacheMisses = 0;
    }

    // Get all available services
    getAllServices() {
        return Object.keys(this.strictPricing);
    }

    // Get services by category
    getServicesByCategory(category) {
        return Object.entries(this.strictPricing)
            .filter(([, service]) => service.category === category)
            .map(([key,]) => key);
    }

    // Get service categories
    getServiceCategories() {
        return [...new Set(Object.values(this.strictPricing).map(service => service.category))];
    }
}

module.exports = PricingService;