const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const {
  ERROR_CODE,
  ERROR_SERVER,
  ERROR_USER,
  ERROR_VALID,
} = require("../constants/constants");

module.exports.login = (req, res) => {
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
    .catch((e) => {
      res
        .status(ERROR_VALID)
        .send({ message: e.message });
    });
};

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(ERROR_SERVER).send({ message: "Произошла ошибка" }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(ERROR_USER).send({ message: "Пользователь не найден" });
      } return res.send({ data: user });
    })
    .catch((e) => {
      if (e.name === "CastError") {
        return res.status(ERROR_CODE).send({ message: "Невалидный id" });
      }
      return res.status(ERROR_CODE).send({ message: "Произошла ошибка" });
    });
};

module.exports.createUser = (req, res) => {
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
            res.status(ERROR_CODE).send({ message: "Некорректные данные" });
          } else {
            res.status(ERROR_SERVER).send({ message: "Произошла ошибка" });
          }
        });
    });
};

module.exports.updateUserInformation = async (req, res) => {
  const { name, about } = req.body;

  if (!name && !about) {
    return res.status(ERROR_CODE).send({ message: "Переданы некорректные данные при обновлении профиля" });
  }
  return User.findByIdAndUpdate(
    req.user._id,
    { name: `${name}`, about: `${about}` },
    { new: true, runValidators: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((e) => {
      if (e.name === "ValidationError") {
        res.status(ERROR_CODE).send({ message: "Переданы некорректные данные при обновлении профиля" });
      } else {
        res.status(ERROR_SERVER).send({ message: "Произошла ошибка" });
      }
    });
};

module.exports.infoAboutUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return res.status(ERROR_USER).send({ message: "Пользователь не найден" });
      } return res.send({ data: user });
    });
};

module.exports.updateUserAvatar = async (req, res) => {
  const { avatar } = req.body;

  if (!avatar) {
    return res.status(ERROR_CODE).send({ message: "Переданы некорректные данные при обновлении профиля" });
  }
  return User.findByIdAndUpdate(
    req.user._id,
    { avatar: `${avatar}` },
    { new: true, runValidators: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((e) => {
      if (e.name === "ValidationError") {
        res.status(ERROR_CODE).send({ message: "Переданы некорректные данные при обновлении профиля" });
      } else {
        res.status(ERROR_SERVER).send({ message: "Произошла ошибка" });
      }
    });
};
