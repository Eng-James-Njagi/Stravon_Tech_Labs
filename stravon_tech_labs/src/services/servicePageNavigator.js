const servicePageNavigator = {
    // Service page mapping
    servicePages: {
        basicWebsite: {
            id: "#basic-website-section",
            title: "Basic Website",
            description: "Perfect for small businesses getting started online",
            keywords: ["basic", "simple", "startup", "small business", "affordable"]
        },
        businessWebsite: {
            id: "#business-website-section", 
            title: "Business Website",
            description: "Professional websites for established businesses",
            keywords: ["business", "professional", "corporate", "company"]
        },
        ecommerce: {
            id: "#ecommerce-section",
            title: "E-commerce Website",
            description: "Full-featured online stores",
            keywords: ["ecommerce", "online store", "shop", "selling", "products"]
        },
        premiumSolutions: {
            id: "#premium-solutions-section",
            title: "Premium Solutions",
            description: "Custom web applications and enterprise solutions",
            keywords: ["custom", "premium", "enterprise", "advanced", "complex"]
        },
        logoDesign: {
            id: "#logo-design-section",
            title: "Logo Design",
            description: "Professional logo design services",
            keywords: ["logo", "branding", "identity", "design"]
        },
        brandIdentity: {
            id: "#brand-identity-section",
            title: "Brand Identity",
            description: "Complete brand identity packages",
            keywords: ["brand", "identity", "branding", "complete package"]
        },
        marketingMaterials: {
            id: "#marketing-materials-section",
            title: "Marketing Materials",
            description: "Print and digital marketing materials",
            keywords: ["marketing", "materials", "brochures", "flyers", "graphics"]
        }
    },

    // Detect service interest from conversation
    detectServiceInterest: function(conversationHistory) {
        const allText = conversationHistory
            .filter(msg => msg.role === 'user')
            .map(msg => msg.content.toLowerCase())
            .join(' ');

        const detectedServices = [];

        // Check each service for keyword matches
        Object.entries(this.servicePages).forEach(([serviceKey, serviceInfo]) => {
            const keywordMatches = serviceInfo.keywords.filter(keyword => 
                allText.includes(keyword)
            );
            
            if (keywordMatches.length > 0) {
                detectedServices.push({
                    service: serviceKey,
                    confidence: keywordMatches.length / serviceInfo.keywords.length,
                    matchedKeywords: keywordMatches,
                    serviceInfo: serviceInfo
                });
            }
        });

        // Sort by confidence
        return detectedServices.sort((a, b) => b.confidence - a.confidence);
    },

    // Get service page navigation for response
    getServicePageNavigation: function(serviceType) {
        const service = this.servicePages[serviceType];
        if (!service) return null;

        return {
            pageId: service.id,
            title: service.title,
            description: service.description,
            navigationText: `Learn more about our ${service.title} services`,
            callToAction: `Click here to see our ${service.title} portfolio and details`
        };
    },

    // Generate service recommendations based on conversation
    generateServiceRecommendations: function(conversationContext) {
        const recommendations = [];
        
        // Check business type and size
        const businessInfo = conversationContext.businessInfo || {};
        const challenges = conversationContext.challenges || [];
        const goals = conversationContext.goals || [];

        // Analyze business needs
        if (businessInfo.type === 'startup' || businessInfo.size === 'small') {
            recommendations.push({
                service: 'basicWebsite',
                reason: 'Perfect for small businesses getting started online',
                priority: 'high'
            });
        }

        if (businessInfo.type === 'established' || businessInfo.size === 'medium') {
            recommendations.push({
                service: 'businessWebsite',
                reason: 'Professional solution for established businesses',
                priority: 'high'
            });
        }

        // Check for e-commerce needs
        const ecommerceKeywords = ['sell', 'products', 'inventory', 'payments', 'online store'];
        const needsEcommerce = ecommerceKeywords.some(keyword => 
            JSON.stringify(conversationContext).toLowerCase().includes(keyword)
        );

        if (needsEcommerce) {
            recommendations.push({
                service: 'ecommerce',
                reason: 'Based on your need to sell products online',
                priority: 'high'
            });
        }

        // Check for branding needs
        const brandingKeywords = ['brand', 'logo', 'identity', 'design'];
        const needsBranding = brandingKeywords.some(keyword => 
            JSON.stringify(conversationContext).toLowerCase().includes(keyword)
        );

        if (needsBranding) {
            recommendations.push({
                service: 'logoDesign',
                reason: 'To establish your brand identity',
                priority: 'medium'
            });
        }

        // Check for marketing needs
        const marketingKeywords = ['marketing', 'advertising', 'promotion'];
        const needsMarketing = marketingKeywords.some(keyword => 
            JSON.stringify(conversationContext).toLowerCase().includes(keyword)
        );

        if (needsMarketing) {
            recommendations.push({
                service: 'marketingMaterials',
                reason: 'To support your marketing efforts',
                priority: 'medium'
            });
        }

        return recommendations.sort((a, b) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
    },

    // Format service recommendations for AI response
    formatServiceRecommendations: function(recommendations) {
        if (recommendations.length === 0) return '';

        const formatted = recommendations.map(rec => {
            const service = this.servicePages[rec.service];
            return `**${service.title}** - ${rec.reason}`;
        });

        return `Based on our conversation, here are some services that might be perfect for you:\n\n${formatted.join('\n')}\n\nWould you like to learn more about any of these services?`;
    },

    // Get service page link with context
    getServicePageLink: function(serviceType, context = '') {
        const service = this.servicePages[serviceType];
        if (!service) return null;

        return {
            pageId: service.id,
            linkText: `Learn more about ${service.title}`,
            contextualMessage: context ? `${context} You can see examples and details on our ${service.title} page.` : `Check out our ${service.title} page for more details.`
        };
    },

    // Check if user is ready for service page navigation
    isReadyForServiceNavigation: function(conversationStage, conversationContext) {
        // Ready if:
        // 1. Past discovery stage (stage 3+)
        // 2. Has shown interest in specific services
        // 3. Has discussed needs/challenges
        
        return conversationStage >= 3 && (
            (conversationContext.servicesInterest && conversationContext.servicesInterest.length > 0) ||
            (conversationContext.challenges && conversationContext.challenges.length > 0) ||
            (conversationContext.goals && conversationContext.goals.length > 0)
        );
    }
};

module.exports = servicePageNavigator;