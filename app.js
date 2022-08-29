const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ERROR_CODE = 400;
const ERROR_USER = 404;
const ERROR_SERVER = 500;
const SUCCESS_CODE = 200;


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


app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log('Ссылка на сервер');
  console.log(`localhost:${PORT}`);
});

app.get('/', (req, res) => {
    res.status(200).send(`
    <html>
    <body>
        <p>Ответ на сигнал из далёкого космоса</p>
    </body>
    </html>
    `)

})