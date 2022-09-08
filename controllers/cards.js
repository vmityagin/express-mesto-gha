const Card = require("../models/card");
const NotCorrectData = require("../errors/not-correct-data");
const NotFoundData = require("../errors/not-found-data");
const NotValidData = require("../errors/not-valid-data");
const ServerError = require("../errors/server-error");
const NotCredentialsData = require("../errors/not-credentials-data");

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(() => { throw new ServerError("Произошла ошибка"); })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((e) => {
      if (e.name === "ValidationError") {
        throw new NotCorrectData("Некорректные данные");
      } else {
        throw new ServerError("Произошла ошибка");
      }
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundData("Ошибка, такого id не существует");
      } else if (card.owner !== req.user._id) {
        throw new NotCredentialsData("Вы не можете удалить чужую карточку");
      } else {
        res.send({ data: card });
      }
    })
    .catch((e) => {
      if (e.name === "CastError") {
        throw new NotValidData("Невалидный id ");
      }
      throw new ServerError("Произошла ошибка");
    })
    .catch(next);
};

module.exports.putLike = async (req, res, next) => {
  await Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        return res.send({ data: card });
      }
      throw new NotFoundData("Передан несуществующий _id карточки");
    })
    .catch((e) => {
      if (e.kind === "ObjectId") {
        throw new NotFoundData("Передан несуществующий _id карточки");
      }
      throw new ServerError("Произошла ошибка");
    })
    .catch(next);
};

module.exports.deleteLike = async (req, res, next) => {
  await Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        return res.send({ data: card });
      }
      throw new NotFoundData("Передан несуществующий _id карточки");
    })
    .catch((e) => {
      if (e.kind === "ObjectId") {
        throw new NotCorrectData(`Карточка с таким id:${req.params.cardId} не найдена`);
      }
      throw new ServerError("Произошла ошибка");
    })
    .catch(next);
};
