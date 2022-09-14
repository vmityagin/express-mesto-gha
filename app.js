const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const routes = require('./routes/routes');
const { errorsCheck } = require('./middlewares/errors');

const { PORT = 3000 } = process.env;
const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true, useUnifiedTopology: true,
});

app.use(routes);

app.use(errors());

app.use(errorsCheck);

app.listen(PORT, () => {
  console.log(`${PORT}`);
});
