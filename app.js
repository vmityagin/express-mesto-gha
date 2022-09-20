const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const routes = require('./routes/routes');
const { errorsCheck } = require('./middlewares/errors');
const { errorLogger, requestLogger } = require('./middlewares/logger');

const whitelist = ['https://mesto.vmityagin.nomoredomains.sbs', 'http://mesto.vmityagin.nomoredomains.sbs', 'localhost:3000'];
const corsOptionsDelegate = (req, callback) => {
  let corsOptions = {};
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true, useUnifiedTopology: true,
});

app.use(requestLogger);
app.use(routes, cors(corsOptionsDelegate));
app.use(errorLogger);

app.use(errors());

app.use(errorsCheck);

module.exports = app;
