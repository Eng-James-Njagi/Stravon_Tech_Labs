const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');

// Rate limiting for chat messages
const chatRateLimit = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 20, // limit each IP to 20 requests per windowMs
    message: {
        error: 'Too many messages sent, please try again later.',
        success: false
    }
});

// Validation middleware for chat messages
const validateChatMessage = [
    body('message')
        .trim()
        .isLength({ min: 1, max: 1000 })
        .withMessage('Message must be between 1 and 1000 characters'),
    body('sessionId')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Session ID is required'),
    body('userId')
        .optional()
        .trim()
        .isLength({ min: 1 })
        .withMessage('User ID must be valid if provided')
];

// Chat message endpoint
router.post('/message', 
    chatRateLimit,
    validateChatMessage,
    async (req, res) => {
        try {
            // Check validation results
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: 'Validation failed',
                    details: errors.array(),
                    success: false
                });
            }

            // Handle chat message through AI controller
            await aiController.handleChatMessage(req, res);

        } catch (error) {
            console.error('Chat route error:', error);
            res.status(500).json({
                error: 'Internal server error',
                success: false
            });
        }
    }
);

// Get conversation data endpoint
router.get('/conversation/:sessionId', async (req, res) => {
    try {
        await aiController.getConversationData(req, res);
    } catch (error) {
        console.error('Conversation data route error:', error);
        res.status(500).json({
            error: 'Internal server error',
            success: false
        });
    }
});

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Chat service is running',
        timestamp: new Date().toISOString()
    });
});

// Start new conversation endpoint
router.post('/start', (req, res) => {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    res.json({
        success: true,
        sessionId: sessionId,
        message: 'New conversation started',
        timestamp: new Date().toISOString()
    });
});

// Add this before the module.exports line in your chat.js file

// Initialize chat session endpoint
router.post('/session', (req, res) => {
    try {
        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        res.json({
            success: true,
            sessionId: sessionId,
            message: 'Chat session initialized successfully',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error initializing chat session:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to initialize chat session'
        });
    }
});

module.exports = router;