const router = require('express').Router();
const cors = require('cors');
const { celebrate, Joi } = require('celebrate');
const { auth } = require('../middlewares/auth');
const userRouter = require('./users');
const cardRouter = require('./cards');
const {
  login,
  createUser,
} = require('../controllers/users');
const { regularLinkRegExp } = require('../constants/constants');
const NotFoundData = require('../errors/not-found-data');

const whitelist = ['https://mesto.vmityagin.nomoredomains.sbs', 'http://mesto.vmityagin.nomoredomains.sbs', 'http://localhost:3000'];
const corsOptionsDelegate = (req, callback) => {
  let corsOptions = {};
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};

router.post('/signin', cors(corsOptionsDelegate), celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ minDomainSegments: 1 }),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', cors(corsOptionsDelegate), celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regularLinkRegExp),
    email: Joi.string().required().email({ minDomainSegments: 1 }),
    password: Joi.string().required(),
  }),
}), createUser);

router.use('/users', cors(corsOptionsDelegate), auth, userRouter);
router.use('/cards', cors(corsOptionsDelegate), auth, cardRouter);

router.use(cors(corsOptionsDelegate), auth, (req, res, next) => {
  next(new NotFoundData('Такого запроса не существует'));
});

module.exports = router;
