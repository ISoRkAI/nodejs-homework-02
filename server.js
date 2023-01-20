require('dotenv').config();
const { connectMongo } = require('./src/db/connection');

const app = require('./app');

const start = async () => {
  connectMongo();

  app.listen(8088, () => {
    console.log('Server running. Use our API on port: 8088');
  });
};
start();
