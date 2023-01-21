const mongoose = require('mongoose');
require('dotenv').config();
mongoose.set('strictQuery', true);

const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Database connection successful');
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};
module.exports = {
  connectMongo,
};
