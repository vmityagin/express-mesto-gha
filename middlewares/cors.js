const app = require('../app');

const allowedCors = [
  'https://mesto.vmityagin.nomoredomains.sbs',
  'http://mesto.vmityagin.nomoredomains.sbs',
  'localhost:3000',
];

app.use((req, res, next) => {
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = "GET,HEAD,PUT,PATCH,POST,DELETE";
  const { origin } = req.headers;
  const requestHeaders = req.headers['access-control-request-headers'];

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  next();
});
