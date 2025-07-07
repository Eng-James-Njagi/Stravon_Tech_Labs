class PricingService {
    constructor() {
        this.strictPricing = {
            basicWebsite: {
                range: "KES 8,000 - 15,000",
                includes: ["responsive design", "contact forms", "basic SEO"],
                servicePageId: "#basic-website-section",
                exactResponse: "At Stravon Tech Labs, we offer basic websites starting from KES 8,000 to 15,000. This includes responsive design, contact forms, and basic SEO. Perfect for small businesses getting started online."
            },
            
            businessWebsite: {
                range: "KES 15,000 - 30,000",
                includes: ["professional design", "CMS", "social media integration", "advanced SEO"],
                servicePageId: "#business-website-section",
                exactResponse: "Our business websites at Stravon range from KES 15,000 to 30,000. This includes professional design, content management system, social media integration, and advanced SEO."
            },
            
            ecommerce: {
                range: "KES 25,000 - 50,000",
                includes: ["online store setup", "payment gateway", "inventory management", "mobile optimization"],
                servicePageId: "#ecommerce-section",
                exactResponse: "At Stravon Tech Labs, our e-commerce solutions start from KES 25,000 to 50,000. This includes online store setup, payment gateway integration, inventory management, and mobile optimization."
            },
            
            premiumSolutions: {
                range: "KES 50,000 - 350,000",
                includes: ["custom web applications", "advanced features", "enterprise solutions"],
                servicePageId: "#premium-solutions-section",
                exactResponse: "Our premium solutions at Stravon range from KES 50,000 to 350,000, depending on complexity. This includes custom web applications, advanced e-commerce features, and enterprise solutions."
            },
            
            logoDesign: {
                range: "KES 2,000 - 10,000",
                includes: ["multiple concepts", "unlimited revisions", "various file formats"],
                servicePageId: "#logo-design-section",
                exactResponse: "At Stravon Tech Labs, logo design services range from KES 2,000 to 10,000. This includes multiple concepts, unlimited revisions, and various file formats."
            },
            
            brandIdentity: {
                range: "KES 5,000 - 25,000",
                includes: ["logo", "color palette", "typography", "business cards", "brand guidelines"],
                servicePageId: "#brand-identity-section",
                exactResponse: "Our brand identity packages at Stravon start from KES 5,000 to 25,000. This includes logo, color palette, typography, business cards, and brand guidelines."
            },
            
            marketingMaterials: {
                range: "KES 1,000 - 15,000",
                includes: ["brochures", "flyers", "social media graphics", "digital advertisements"],
                servicePageId: "#marketing-materials-section",
                exactResponse: "At Stravon Tech Labs, marketing materials range from KES 1,000 to 15,000. This includes brochures, flyers, social media graphics, and digital advertisements."
            }
        };
    }

    validatePricing(response, conversationStage = 6) {
        // Only validate pricing if conversation is ready (stage 6+)
        if (conversationStage < 6) return response;
        
        // Check if response contains any pricing information
        const pricingPatterns = [
            /KES\s*\d+/gi,
            /\d+\s*KES/gi,
            /\d+,\d+/gi,
            /\d+k/gi,
            /cost/gi,
            /price/gi,
            /budget/gi
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
        return this.correctPricing(response);
    }

    correctPricing(response) {
        let correctedResponse = response;
        
        // Define correction patterns and their replacements
        const corrections = [
            {
                pattern: /basic\s+website.*?(?:KES\s*)?(?:\d+,?\d*\s*(?:-|to)\s*)?(?:KES\s*)?\d+,?\d*/gi,
                replacement: this.strictPricing.basicWebsite.exactResponse
            },
            {
                pattern: /business\s+website.*?(?:KES\s*)?(?:\d+,?\d*\s*(?:-|to)\s*)?(?:KES\s*)?\d+,?\d*/gi,
                replacement: this.strictPricing.businessWebsite.exactResponse
            },
            {
                pattern: /e-?commerce.*?(?:KES\s*)?(?:\d+,?\d*\s*(?:-|to)\s*)?(?:KES\s*)?\d+,?\d*/gi,
                replacement: this.strictPricing.ecommerce.exactResponse
            },
            {
                pattern: /premium\s+solutions.*?(?:KES\s*)?(?:\d+,?\d*\s*(?:-|to)\s*)?(?:KES\s*)?\d+,?\d*/gi,
                replacement: this.strictPricing.premiumSolutions.exactResponse
            },
            {
                pattern: /logo\s+design.*?(?:KES\s*)?(?:\d+,?\d*\s*(?:-|to)\s*)?(?:KES\s*)?\d+,?\d*/gi,
                replacement: this.strictPricing.logoDesign.exactResponse
            },
            {
                pattern: /brand\s+identity.*?(?:KES\s*)?(?:\d+,?\d*\s*(?:-|to)\s*)?(?:KES\s*)?\d+,?\d*/gi,
                replacement: this.strictPricing.brandIdentity.exactResponse
            },
            {
                pattern: /marketing\s+materials.*?(?:KES\s*)?(?:\d+,?\d*\s*(?:-|to)\s*)?(?:KES\s*)?\d+,?\d*/gi,
                replacement: this.strictPricing.marketingMaterials.exactResponse
            }
        ];

        // Apply corrections
        corrections.forEach(({ pattern, replacement }) => {
            if (pattern.test(correctedResponse)) {
                correctedResponse = correctedResponse.replace(pattern, replacement);
            }
        });

        return correctedResponse;
    }

    identifyRelevantServices(userMessage, conversationHistory = []) {
        const message = userMessage.toLowerCase();
        const history = conversationHistory.join(' ').toLowerCase();
        const fullContext = `${history} ${message}`;
        
        const relevantServices = [];
        
        // Check for website-related needs
        if (this.containsWebsiteKeywords(fullContext)) {
            if (this.containsEcommerceKeywords(fullContext)) {
                relevantServices.push('ecommerce');
            } else if (this.containsComplexKeywords(fullContext)) {
                relevantServices.push('premiumSolutions');
            } else if (this.containsBusinessKeywords(fullContext)) {
                relevantServices.push('businessWebsite');
            } else {
                relevantServices.push('basicWebsite');
            }
        }
        
        // Check for design-related needs
        if (this.containsLogoKeywords(fullContext)) {
            relevantServices.push('logoDesign');
        }
        
        if (this.containsBrandKeywords(fullContext)) {
            relevantServices.push('brandIdentity');
        }
        
        if (this.containsMarketingKeywords(fullContext)) {
            relevantServices.push('marketingMaterials');
        }
        
        return relevantServices;
    }

    containsWebsiteKeywords(text) {
        const keywords = ['website', 'web', 'site', 'online presence', 'web development', 'web design'];
        return keywords.some(keyword => text.includes(keyword));
    }

    containsEcommerceKeywords(text) {
        const keywords = ['ecommerce', 'e-commerce', 'online store', 'shop', 'sell online', 'store', 'cart', 'payment'];
        return keywords.some(keyword => text.includes(keyword));
    }

    containsComplexKeywords(text) {
        const keywords = ['custom', 'complex', 'advanced', 'enterprise', 'system', 'application', 'database'];
        return keywords.some(keyword => text.includes(keyword));
    }

    containsBusinessKeywords(text) {
        const keywords = ['business', 'professional', 'corporate', 'company', 'portfolio', 'services'];
        return keywords.some(keyword => text.includes(keyword));
    }

    containsLogoKeywords(text) {
        const keywords = ['logo', 'brand mark', 'identity mark', 'company logo'];
        return keywords.some(keyword => text.includes(keyword));
    }

    containsBrandKeywords(text) {
        const keywords = ['brand', 'branding', 'brand identity', 'visual identity', 'brand package'];
        return keywords.some(keyword => text.includes(keyword));
    }

    containsMarketingKeywords(text) {
        const keywords = ['marketing', 'flyer', 'brochure', 'poster', 'banner', 'advertisement', 'promotional'];
        return keywords.some(keyword => text.includes(keyword));
    }

    getPricingForService(serviceType) {
        const service = this.strictPricing[serviceType];
        if (!service) return null;
        
        return {
            range: service.range,
            includes: service.includes,
            servicePageId: service.servicePageId,
            response: service.exactResponse
        };
    }

    getPricingForServices(services) {
        const pricing = {};
        
        services.forEach(service => {
            if (this.strictPricing[service]) {
                pricing[service] = {
                    range: this.strictPricing[service].range,
                    includes: this.strictPricing[service].includes,
                    servicePageId: this.strictPricing[service].servicePageId,
                    exactResponse: this.strictPricing[service].exactResponse
                };
            }
        });
        
        return pricing;
    }

    shouldShowPricing(conversationStage) {
        // Only show pricing in later stages (6-7)
        return conversationStage >= 6;
    }

    checkPricingTiming(conversationHistory) {
        // Analyze conversation depth and readiness
        const totalMessages = conversationHistory.length;
        const userMessages = conversationHistory.filter(msg => msg.role === 'user').length;
        
        // Need at least 3 exchanges before pricing
        if (userMessages < 3) return false;
        
        // Check if user has asked about pricing explicitly
        const lastUserMessage = conversationHistory[conversationHistory.length - 1];
        if (lastUserMessage && lastUserMessage.role === 'user') {
            const pricingKeywords = ['cost', 'price', 'pricing', 'budget', 'how much', 'what does it cost'];
            const message = lastUserMessage.content.toLowerCase();
            
            return pricingKeywords.some(keyword => message.includes(keyword));
        }
        
        return false;
    }

    formatPricingResponse(services, conversationContext = { stage: 6 }) {
        if (!this.shouldShowPricing(conversationContext.stage)) {
            return null; // Don't show pricing yet
        }

        const pricing = this.getPricingForServices(services);
        
        if (Object.keys(pricing).length === 0) {
            return null;
        }

        // Format the response based on how many services
        if (Object.keys(pricing).length === 1) {
            const service = Object.keys(pricing)[0];
            return pricing[service].exactResponse;
        } else {
            // Multiple services - format appropriately
            let response = "Based on what you've shared, here's what would work well for your business:\n\n";
            
            Object.entries(pricing).forEach(([service, details]) => {
                response += `• ${details.exactResponse}\n`;
            });
            
            return response;
        }
    }

    addServicePageNavigation(response, serviceType) {
        const service = this.strictPricing[serviceType];
        if (!service) return response;
        
        return `${response} You can learn more about this service on our website by clicking [here](${service.servicePageId}).`;
    }
}

module.exports = PricingService;