const Card = require("../models/card");
const { ERROR_CODE, ERROR_USER, ERROR_SERVER } = require("../constants/constants");

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(ERROR_SERVER).send({ message: "Произошла ошибка" }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((e) => {
      if (e.name === "ValidationError") {
        res.status(ERROR_CODE).send({ message: "Некорректные данные" });
      } else {
        res.status(ERROR_SERVER).send({ message: "Произошла ошибка" });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(ERROR_USER).send({ message: "Ошибка, такого id не существует" });
      } else if (card.owner !== req.user._id) {
        res.status(ERROR_USER).send({ message: "Вы не можете удалить чужую карточку" });
      } else {
        res.send({ data: card });
      }
    })
    .catch((e) => {
      if (e.name === "CastError") {
        res.status(ERROR_CODE).send({ message: "Невалидный id " });
      }
      res.status(ERROR_CODE).send({ message: "Произошла ошибка" });
    });
};

module.exports.putLike = async (req, res) => {
  await Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        return res.send({ data: card });
      }
      return res.status(ERROR_USER).send({ message: "Передан несуществующий _id карточки" });
    })
    .catch((e) => {
      if (e.kind === "ObjectId") {
        return res.status(ERROR_CODE).send({ message: "Передан несуществующий _id карточки" });
      }
      return res.status(ERROR_SERVER).send({ message: "Произошла ошибка" });
    });
};

module.exports.deleteLike = async (req, res) => {
  await Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        return res.send({ data: card });
      }
      return res.status(ERROR_USER).send({ message: "Передан несуществующий _id карточки" });
    })
    .catch((e) => {
      if (e.kind === "ObjectId") {
        res.status(ERROR_CODE).send({ message: `Карточка с таким id:${req.params.cardId} не найдена` });
      }
      return res.status(ERROR_SERVER).send({ message: "Произошла ошибка" });
    });
};
