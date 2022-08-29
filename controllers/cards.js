const Card = require('../models/card');
const ERROR_CODE = 400;
const ERROR_USER = 404;
const ERROR_SERVER = 500;
const SUCCESS_CODE = 200;

module.exports.getAllCards = (req, res) => {
    Card.find({})
    .then(card => res.status(SUCCESS_CODE).send({ data: card }))
    .catch((e) => res.status(ERROR_SERVER).send({ message: 'Произошла ошибка', ...e }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({name, link, owner: req.user._id})
  .then(card => res.status(SUCCESS_CODE).send({ data: card }))
  .catch((e) => {
    if(e.name === "ValidationError" || e.link === "ValidationError") {
      res.status(ERROR_CODE).send({message: `Переданы некорректные данные в методы создания карточки`});
      return;
    }
    res.status(ERROR_SERVER).send({ message: 'Произошла ошибка', ...e  })
  });
};

module.exports.deleteCard = (req, res) => {
  if(req.params.id) {
    User.findByIdAndRemove(req.params.id)
    .then(card => res.status(SUCCESS_CODE).send({ data: card }))
    .catch((e) => res.status(ERROR_SERVER).send({ message: 'Произошла ошибка', ...e  }));
  }
  return res.status(ERROR_USER).send({ message: 'Карточка с указанным _id не найдена.'});
};

module.exports.putLike = async (req, res) => {
  await Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    {new: true})
  .then((card) => {
      res.status(SUCCESS_CODE).send({ data: card });
  })
  .catch((e) => {
    if(e.kind === 'ObjectId') {
      return res.status(ERROR_USER).send({message: 'Передан несуществующий _id карточки'})
    } else if (err.name === 'SomeErrorName') {
      return res.status(ERROR_CODE).send({message: ' Переданы некорректные данные для постановки/снятии лайка.'})
    }
    return res.status(ERROR_SERVER).send({ message: 'Произошла ошибка'});
  });
};

module.exports.deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    {new: true}
  )
  .then(card => res.status(SUCCESS_CODE).send({ data: card }))
  .catch((e) => {
    if(e.kind === 'ObjectId') {
      res.status(ERROR_USER).send({message: `Карточка с таким id:${req.params.cardId} не найдена`})
    } else if (err.name === 'SomeErrorName') {
      return res.status(ERROR_CODE).send({message: ' Переданы некорректные данные для постановки/снятии лайка.'})
    }
    res.status(ERROR_SERVER).send({ message: 'Произошла ошибка'})
  });
};