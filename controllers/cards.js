const Card = require('../models/card');

module.exports.getAllCards = (req, res) => {
    Card.find({})
    .then(card => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({name, link, owner: req.user._id})
  .then(card => res.send({ data: card }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.deleteCard = (req, res) => {
  User.findByIdAndRemove(req.params.id)
  .then(card => res.send({ data: card }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.putLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    {new: true}
  )
  .then(card => res.send({ data: card }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    {new: true}
  )
  .then(card => res.send({ data: card }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};