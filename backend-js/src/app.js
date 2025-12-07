const express = require('express');
const app = express();
require('dotenv').config();
const routes = require('./routes');
const cors = require('cors');
// const errorHandler = require('./middlewares/error.middleware');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use((req, res, next) => {
  console.log(`\n📨 ${req.method} ${req.path}`);
  console.log('Content-Type:', req.headers['content-type']);
  next();
});

app.use('/api', routes); 


// app.use(errorHandler); 

module.exports = app;
