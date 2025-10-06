require('dotenv').config(); // load .env variables
const express = require('express');
const mongoose = require('mongoose');
const authroutes=require('./routes/Authroutes');

const app = express();
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));
app.use(express.json());
app.get('/', (req, res) => res.send("API running..."));
app.use('/api/auth', authroutes);
app.listen(process.env.PORT, () => console.log(`🚀 Server running on port ${process.env.PORT}`));
