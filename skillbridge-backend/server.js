// ============================================================
//  server.js — SkillBridge API entry point
//  Start:  npm run dev  (development)
//          npm start    (production)
// ============================================================
require('dotenv').config();

const express  = require('express');
const cors     = require('cors');
const passport = require('passport');

const connectDB      = require('./config/db');
const errorHandler   = require('./middleware/errorHandler');

// ── Route files ──────────────────────────────────────────────────
const authRoutes      = require('./routes/auth');
const userRoutes      = require('./routes/users');
const studentRoutes   = require('./routes/students');
const guideRoutes     = require('./routes/guides');
const hireRoutes      = require('./routes/hire');
const dashboardRoutes = require('./routes/dashboard');

// ── Connect to MongoDB Atlas ─────────────────────────────────────
connectDB();

// ── Load Passport Google strategy ────────────────────────────────
require('./config/passport')(passport);

const app = express();

// ── CORS — allow frontend origins ────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL,      // from .env  (e.g. Vercel URL)
  'http://localhost:5500',
  'http://127.0.0.1:5500',       // VS Code Live Server
  'http://localhost:5501',
  'http://127.0.0.1:5501',
  'http://localhost:3000',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman)
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// ── Body parsers ─────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Passport init ────────────────────────────────────────────────
app.use(passport.initialize());

// ── API Routes ───────────────────────────────────────────────────
app.use('/api/auth',      authRoutes);
app.use('/api/users',     userRoutes);
app.use('/api/students',  studentRoutes);
app.use('/api/guides',    guideRoutes);
app.use('/api/hire',      hireRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ── Health check ─────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SkillBridge API is running ✅' });
});

// ── 404 handler ──────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ── Global error handler (must be last) ──────────────────────────
app.use(errorHandler);

// ── Start server ─────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 SkillBridge API running on http://localhost:${PORT}`);
  console.log(`📋 Environment: ${process.env.NODE_ENV}`);
});
