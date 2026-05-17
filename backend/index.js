const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');
const verifyToken = require('./middleware/auth');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Supabase Admin (Server-side)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Export supabase for routes
app.set('supabase', supabase);

// Middleware
app.use(cors());
app.use(express.json());

// Base Route
app.get('/', (req, res) => {
  res.send('AuraInvite Elite API is running...');
});

app.get('/health', (req, res) => {
  res.status(200).json({ success: true, status: 'ok' });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, status: 'ok' });
});

app.get('/api/me', verifyToken, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`AuraInvite Server is running on port ${PORT}`);
});
