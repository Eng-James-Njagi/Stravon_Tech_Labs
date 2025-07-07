const express = require('express');
const router = express.Router();

// Contact form endpoint (enhanced for AI data)
router.post('/submit', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      message,
      // Enhanced AI conversation data
      conversationSummary,
      aiRecommendations,
      suggestedServices,
      selectedService,
      pricingDiscussed,
      businessType,
      leadQualityScore,
      conversationStage
    } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and message are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address'
      });
    }

    // Prepare email data with AI insights
    const emailData = {
      // Basic form fields
      name,
      email,
      phone: phone || 'Not provided',
      company: company || 'Not provided',
      message,
      
      // AI conversation insights
      conversation_summary: conversationSummary || 'No conversation data',
      ai_recommendations: aiRecommendations || 'No AI recommendations',
      suggested_services: suggestedServices || 'No service suggestions',
      selected_service: selectedService || 'No service selected',
      pricing_discussed: pricingDiscussed || 'No pricing discussed',
      business_type: businessType || 'Unknown',
      lead_quality_score: leadQualityScore || 'Not scored',
      conversation_stage: conversationStage || 'Unknown',
      
      // Metadata
      timestamp: new Date().toISOString(),
      source: 'Chat Widget'
    };

    console.log('📧 Enhanced contact form submission:', {
      name,
      email,
      hasConversationData: !!conversationSummary,
      businessType,
      leadQualityScore
    });

    // Here you would integrate with your email service (EmailJS, SendGrid, etc.)
    // For now, we'll just log and return success
    
    // TODO: Implement actual email sending
    // await sendEmail(emailData);
    
    res.json({
      success: true,
      message: 'Thank you for your message! We\'ll get back to you soon.',
      data: {
        submittedAt: emailData.timestamp,
        hasAIInsights: !!conversationSummary,
        leadScore: leadQualityScore
      }
    });
    
  } catch (error) {
    console.error('Contact form error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to submit contact form. Please try again.'
    });
  }
});

// Get contact form with pre-filled data from AI conversation
router.post('/prefill', async (req, res) => {
  try {
    const {
      conversationSummary,
      businessType,
      suggestedServices,
      userInfo
    } = req.body;

    // Generate pre-filled form data based on AI conversation
    const prefillData = {
      company: userInfo?.company || '',
      message: conversationSummary || '',
      selectedService: suggestedServices?.[0] || '',
      businessType: businessType || '',
      source: 'AI Chat Widget'
    };

    res.json({
      success: true,
      prefillData,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Prefill endpoint error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to generate prefill data'
    });
  }
});

module.exports = router;