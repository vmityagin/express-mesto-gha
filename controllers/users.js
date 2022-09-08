const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const NotCorrectData = require("../errors/not-correct-data");
const NotFoundData = require("../errors/not-found-data");
const NotValidData = require("../errors/not-valid-data");
const ServerError = require("../errors/server-error");
const NotUniqData = require("../errors/not-uniq-data");

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id.toString() },
        "some-secret-key",
        { expiresIn: "7d" },
      );
      res.send({ token });
    })
    .catch(() => {
      throw new NotCorrectData("Передан неверный логин или пароль");
    })
    .catch(next);
};

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => { throw new ServerError("Произошла ошибка"); })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundData("Пользователь не найден");
      } return res.send({ data: user });
    })
    .catch((e) => {
      if (e.name === "CastError") {
        throw new NotValidData("Невалидный id");
      }
      throw new ServerError("Произошла ошибка");
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then((user) => res.send({ data: user }))
        .catch((e) => {
          if (e.name === "ValidationError") {
            throw new NotCorrectData("Некорректные данные");
          } else if (e.code === 11000) {
            throw new NotUniqData("При регистрации указан email, который уже существует на сервере");
          } else {
            console.log(e);
            throw new ServerError("Произошла ошибка");
          }
        })
        .catch(next);
    });
};

module.exports.updateUserInformation = async (req, res, next) => {
  const { name, about } = req.body;

  if (!name && !about) {
    throw new NotCorrectData("Переданы некорректные данные при обновлении профиля");
  }
  return User.findByIdAndUpdate(
    req.user._id,
    { name: `${name}`, about: `${about}` },
    { new: true, runValidators: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((e) => {
      if (e.name === "ValidationError") {
        throw new NotCorrectData("Переданы некорректные данные при обновлении профиля");
      } else {
        throw new ServerError("Произошла ошибка");
      }
    })
    .catch(next);
};

module.exports.updateUserAvatar = async (req, res, next) => {
  const { avatar } = req.body;

  if (!avatar) {
    throw new NotCorrectData("Переданы некорректные данные при обновлении профиля");
  }
  return User.findByIdAndUpdate(
    req.user._id,
    { avatar: `${avatar}` },
    { new: true, runValidators: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((e) => {
      if (e.name === "ValidationError") {
        throw new NotCorrectData("Переданы некорректные данные при обновлении профиля");
      } else {
        throw new ServerError("Произошла ошибка");
      }
    })
    .catch(next);
};

module.exports.infoAboutUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundData("Пользователь не найден");
      } return res.send({ data: user });
    })
    .catch(next);
};
