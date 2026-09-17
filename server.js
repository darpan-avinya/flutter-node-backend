require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/db');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');

const app = express();
const PORT = process.env.PORT || 5000;

// Database Connect કરો
connectDB();

// Body-parser middleware (Flutter તરફથી આવતો JSON ડેટા રીડ કરવા)
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Main Routes
const userRoutes = require('./src/routes/userRoutes');
app.use('/api/users', userRoutes);

const authRoutes = require('./src/routes/authRoutes');
app.use('/api/auth', authRoutes);

// Base Health Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'Server is healthy' });
});

// Server Start
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});