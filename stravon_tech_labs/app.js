console.log('🚀 Starting application...');
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');

console.log('📦 Express loaded successfully');
const app = express();
console.log('🔧 Setting up middleware...');
const PORT = process.env.PORT || 3000;

try {
  // Set EJS as template engine
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));
  console.log('✅ EJS configured');

  // Serve static files
  app.use(express.static(path.join(__dirname, 'public')));
  console.log('✅ Static files configured');

  // Skip favicon for now to avoid errors
  app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

  // Middleware
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  console.log('✅ Body parsing middleware configured');

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

  console.log('✅ Routes configured');

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