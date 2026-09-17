const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error connecting to DB: ${error.message}`);
    process.exit(1); // એરર આવે તો સર્વર બંધ કરી દેવું
  }
};

module.exports = connectDB;