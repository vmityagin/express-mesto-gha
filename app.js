const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {ERROR_USER} = require('./constants/constants');


const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.user = {
    _id: '630b9b252962b37500d4aa42'
  };
  next();
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true, useUnifiedTopology: true
});


app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.listen(PORT, () => {
  console.log('Ссылка на сервер');
  console.log(`localhost:${PORT}`);
});

app.use((req, res) => {
  res.status(ERROR_USER).send({ message: 'Такого запроса не существует' });
  });