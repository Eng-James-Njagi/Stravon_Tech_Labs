console.log('🚀 Starting application...');
require('dotenv').config();
const express = require('express');
const aiController = require('./src/controllers/aiController');
const path = require('path');
const favicon = require('serve-favicon');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

console.log('📦 Express loaded successfully');
const app = express();
console.log('🔧 Setting up middleware...');
const PORT = process.env.PORT || 3000;

try {
  // Set EJS as template engine
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));
  console.log('✅ EJS configured');

  // Serve static files with proper MIME types
  app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, path) => {
      if (path.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
      }
      if (path.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
      }
    }
  }));
  console.log('✅ Static files configured');

  // Skip favicon for now to avoid errors
  app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

  // Middleware
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  console.log('✅ Body parsing middleware configured');

  // Security middleware with updated CSP
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: [
          "'self'", 
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
          "https://fonts.gstatic.com"
        ],
        scriptSrc: [
          "'self'", 
          "'unsafe-inline'", 
          "'unsafe-eval'",
          "https://www.googletagmanager.com",
          "https://www.google-analytics.com"
        ],
        fontSrc: [
          "'self'",
          "https://fonts.googleapis.com",
          "https://fonts.gstatic.com"
        ],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: [
          "'self'", 
          "https://api.openai.com", 
          "https://generativelanguage.googleapis.com", 
          "https://api-inference.huggingface.co", 
          "https://api.cohere.ai",
          "https://www.google-analytics.com"
        ]
      }
    }
  }));

  // CORS configuration
  app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? 'your-domain.com' : 'http://localhost:3000',
    credentials: true
  }));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
  });
  app.use('/api/', limiter);

  // API rate limiting for chat (more restrictive)
  const chatLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10, // limit each IP to 10 chat requests per minute
    message: 'Too many chat requests, please slow down.'
  });
  app.use('/api/chat', chatLimiter);

  console.log('✅ Security and rate limiting configured');
  // Clean up old chat sessions periodically
  setInterval(() => {
    try {
      aiController.cleanupOldSessions();
    } catch (error) {
      console.error('Error cleaning up chat sessions:', error);
    }
  }, 60 * 60 * 1000); // Clean up every hour
  // Routes
  app.get('/', (req, res) => {
    console.log('🏠 Home route accessed');
    res.render('index');
  });

  app.get('/projects', (req, res) => {
    console.log('ℹ️ Projects route accessed');
    res.render('projects');
  });

  app.get('/services', (req, res) => {
    console.log('🔧 Services route accessed');
    res.render('services');
  });

  app.get('/about', (req, res) => {
    console.log('ℹ️ About route accessed');
    res.render('about');
  });

  app.get('/test', (req, res) => {
    console.log('🧪 Test route accessed');
    res.send('TEST ROUTE WORKS!');
  });
  const chatRoutes = require('./src/routes/chat');
  const contactRoutes = require('./src/routes/contact');

  // Use the routes
  app.use('/api/chat', chatRoutes);
  app.use('/api/contact', contactRoutes);

console.log('✅ API routes configured');

  console.log('✅ Routes configured');
  // Error handling middleware
  app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  // AI API specific errors
  if (err.message && err.message.includes('AI_API_ERROR')) {
    return res.status(503).json({
      error: 'AI service temporarily unavailable',
      message: 'Please try again in a moment'
    });
  }
  
  // Rate limiting errors
  if (err.status === 429) {
    return res.status(429).json({
      error: 'Too many requests',
      message: 'Please slow down and try again'
    });
  }
  
  // General server errors
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: 'The requested endpoint does not exist'
  });
});

  // Server startup - works for both local and Vercel
  if (process.env.NODE_ENV !== 'production') {
    // Local development server
    app.listen(PORT, (err) => {
      if (err) {
        console.error('❌ Server failed to start:', err);
        process.exit(1);
      }
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log('🎯 Try visiting: http://localhost:3000/test');
      console.log('🔄 Server is now waiting for requests...');
    });
    
    console.log('✅ Server setup complete');
  } else {
    // Production (Vercel) - just log that setup is complete
    console.log('✅ Server setup complete - Running in production mode');
  }

} catch (error) {
  console.error('❌ Error during setup:', error);
  process.exit(1);
}

// Keep the process alive
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled rejection at:', promise, 'reason:', reason);
});

// Export the app for Vercel
module.exports = app;