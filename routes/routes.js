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

const whitelist = ['https://mesto.vmityagin.nomoredomains.sbs', 'http://mesto.vmityagin.nomoredomains.sbs', 'localhost:3000'];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

router.post('/signin', cors(corsOptions), celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ minDomainSegments: 1 }),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', cors(corsOptions), celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regularLinkRegExp),
    email: Joi.string().required().email({ minDomainSegments: 1 }),
    password: Joi.string().required(),
  }),
}), createUser);

router.use('/users', cors(corsOptions), auth, userRouter);
router.use('/cards', cors(corsOptions), auth, cardRouter);

router.use(cors(corsOptions), auth, (req, res, next) => {
  next(new NotFoundData('Такого запроса не существует'));
});

module.exports = router;
