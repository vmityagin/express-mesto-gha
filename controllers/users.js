const User = require('../models/user');
const {ERROR_CODE, ERROR_USER, ERROR_SERVER} = require('../constants/constants');

module.exports.getAllUsers = (req, res) => {
    User.find({})
    .then(user => res.send({ data: user }))
    .catch(() => res.status(ERROR_SERVER).send({ message: 'Произошла ошибка' }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
  .then((user) => {
    if (!user) {
      return res.status(ERROR_CODE).send({message: 'Пользователь не найден'});
    } else {
      res.send({ data: user });
      return;
    }
  })
  .catch((e) => {
    if (e.name === 'CastError') {
      return res.status(ERROR_CODE).send({ message: 'Невалидный id ' });
    }
    return res.status(ERROR_SERVER).send({ message: 'Произошла ошибка' });
  })
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
  .then(user => res.send({ data: user }))
  .catch((e) => {
    res.status(ERROR_SERVER).send({ message: 'Произошла ошибка' })
  });
};

module.exports.updateUserInformation = async (req, res) => {
  const {name, about} = req.body;

  if (!name && !about) {
    return res.status(ERROR_CODE).send({message: 'Переданы некорректные данные при обновлении профиля'});
  }
  return User.findByIdAndUpdate(
    req.user._id,
    {name: `${name}`, about: `${about}`},
    {new: true, runValidators: true}
  )
  .then((user) => { res.status(SUCCESS_CODE).send({data: user})})
  .catch((e) => {
    if (e.name === 'ValidationError') {
      res.status(ERROR_CODE).send({message: 'Переданы некорректные данные при обновлении профиля'});
    } else {
      res.status(ERROR_SERVER).send({message: 'Произошла ошибка'});
    }
  });
}

module.exports.updateUserAvatar = async (req, res) => {
  const {avatar} = req.body;

  if (!avatar) {
    return res.status(ERROR_CODE).send({message: 'Переданы некорректные данные при обновлении профиля'});
  }
  return User.findByIdAndUpdate(
    req.user._id,
    {avatar: `${avatar}`},
    {new: true, runValidators: true}
  )
  .then((user) => { res.status(SUCCESS_CODE).send({data: user})})
  .catch((e) => {
    if (e.name === 'ValidationError') {
      res.status(ERROR_CODE).send({message: 'Переданы некорректные данные при обновлении профиля'});
    } else {
      res.status(ERROR_SERVER).send({message: 'Произошла ошибка'});
    }
  });
}