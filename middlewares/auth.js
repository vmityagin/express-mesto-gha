require('dotenv').config();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const NotValidData = require('../errors/not-valid-data');
const { NODE_ENV, JWT_SECRET } = proccess.env;

const { JWT_SECRET } = process.env;

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    throw new NotValidData('Необходима авторизация');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
<<<<<<< HEAD
    payload = jwt.verify(token, JWT_SECRET);
=======
    payload = jwt.verify(token, `${JWT_SECRET}`);
>>>>>>> 6e6f3185d913d164e22b60ae2c230ba7ecfa332a
  } catch (e) {
    throw new NotValidData('Необходима авторизация');
  }
  req.user = payload;
  return next();
};
