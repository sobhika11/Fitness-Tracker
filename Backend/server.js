const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') }); // load .env variables
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authroutes = require('./routes/Authroutes');
const chatRoutes = require('./routes/chatRoutes');
const exerciseRoutes = require('./routes/exerciseRoutes');
const mealplanRoutes = require('./routes/mealplanRoutes');
const logRoutes = require('./routes/logRoutes');
const streakRoutes = require('./routes/StreakRoutes');
const profileRoutes = require('./routes/profileRoutes');

require('./utils/Remainderemail');
const app = express();
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => res.send("API running..."));
app.use('/api/auth', authroutes);
app.use('/api/chat', chatRoutes);
app.use('/api/exercise', exerciseRoutes);
app.use('/api/meals', mealplanRoutes);
app.use('/api/log', logRoutes);
app.use('/api/streak', streakRoutes);
app.use('/api/profile', profileRoutes);
app.listen(process.env.PORT, () => console.log(`🚀 Server running on port ${process.env.PORT}`));
