const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route files
const auth = require('./routes/auth');
const sleepPlan = require('./routes/sleepPlan');
const payments = require('./routes/payments');
const margaret = require('./routes/margaret');
const admin = require('./routes/admin');

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Security middleware
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(hpp());

// Rate limiting
const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX || 100
});
app.use('/api/', limiter);

// Enable CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
  credentials: true
}));

// Mount routers
app.use('/api/auth', auth);
app.use('/api/sleep-plan', sleepPlan);
app.use('/api/payments', payments);
app.use('/api/margaret', margaret);
app.use('/api/admin', admin);

// Serve admin dashboard in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder for admin dashboard
  app.use('/admin', express.static(path.join(__dirname, 'admin/build')));

  // Any routes not handled by API will be handled by React
  app.get('/admin/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'admin', 'build', 'index.html'));
  });
}

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});
