const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
// const xss = require('xss-clean');
const hpp = require('hpp');
const { connectDB } = require('./config/db');

// Connect to database
connectDB();

const app = express();

// Security Middlewares
app.use(helmet()); // Set security HTTP headers
// app.use(xss());    // Disabled due to compatibility issues with modern Express/Node
app.use(hpp());    // Prevent parameter pollution

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', limiter);

// Middleware
app.use(express.json({ limit: '10kb' })); // Body parser, limiting data size
app.use(cors({
    origin: [process.env.FRONTEND_URL || 'http://localhost:3000', 'http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
}));
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.get('/api/track/:id', (req, res) => {
    res.redirect(307, `/api/shipments/track/${req.params.id}`);
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/shipments', require('./routes/shipmentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Basic error handler
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

module.exports = app;
