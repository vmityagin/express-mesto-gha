const Card = require('../models/card');
const {ERROR_CODE, ERROR_USER, ERROR_SERVER} = require('../constants/constants');

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
    res.status(ERROR_SERVER).send({ message: 'Произошла ошибка', ...e  })
  });
};

module.exports.deleteCard = (req, res) => {
  User.findByIdAndRemove(req.params.cardid)
  .orFail(() => {
    throw new Error('Not Found');
  })
  .then(card => res.status(SUCCESS_CODE).send({ data: card }))
  .catch((e) => {
    if(e.message === 'NotFound') {
      res.send(ERROR_USER).send({message: 'Пользователь не найден'})
    } else if (e.name === 'CastError') {
      res.status(ERROR_SERVER).send({ message: 'Невалидный id ' });
    }
    res.status(ERROR_SERVER).send({ message: 'Произошла ошибка' })
    }
  );
};

module.exports.putLike = async (req, res) => {
  await Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    {new: true})
  .then((card) => {
    if (card) {
      return res.status(SUCCESS_CODE).send({ data: card });
    }
    return res.status(ERROR_USER).send({message: 'Передан несуществующий _id карточки'})
  })
  .catch((e) => {
    if(e.kind === 'ObjectId') {
      return res.status(ERROR_CODE).send({message: 'Передан несуществующий _id карточки'})
    }
    return res.status(ERROR_SERVER).send({ message: 'Произошла ошибка'});
  });
};

module.exports.deleteLike = async (req, res) => {
  await Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    {new: true}
  )
  .then((card) => {
    if (card) {
      return res.status(SUCCESS_CODE).send({ data: card });
    }
    return res.status(ERROR_USER).send({message: 'Передан несуществующий _id карточки'})
  })
  .catch((e) => {
    if(e.kind === 'ObjectId') {
      res.status(ERROR_USER).send({message: `Карточка с таким id:${req.params.cardId} не найдена`})
    }
    return res.status(ERROR_SERVER).send({ message: 'Произошла ошибка'})
  });
};