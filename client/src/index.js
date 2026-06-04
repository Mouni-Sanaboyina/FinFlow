require('dotenv').config();
const express = require('express');
const cors = require('cors');
const chatRoutes = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://fin-flow-ruddy.vercel.app'
    ],
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use('/api/chat', chatRoutes);

// Home Route
app.get('/', (req, res) => {
  res.send('🚀 FinFlow API is running');
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'FinFlow Loan Assistant API',
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`🚀 FinFlow Loan Assistant API running on port ${PORT}`);
});
