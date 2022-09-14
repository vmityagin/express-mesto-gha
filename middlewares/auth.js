const jwt = require('jsonwebtoken');
const NotValidData = require('../errors/not-valid-data');

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    throw new NotValidData('Необходима авторизация');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (e) {
    throw new NotValidData('Необходима авторизация');
  }
  req.user = payload;
  return next();
};
