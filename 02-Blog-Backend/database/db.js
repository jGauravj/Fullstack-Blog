const mongoose = require("mongoose");

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_URL, {
      autoIndex: true,
    });
    console.log("MongoDB connected successfully");
  } catch (e) {
    console.log("MongoDB connection failed: ", e.message);
  }
};

module.exports = connectToDB;
