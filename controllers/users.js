const User = require('../models/user');

module.exports.getAllUsers = (req, res) => {
    User.find({})
    .then(user => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params._id)
  .then(user => res.send({ data: user }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
  .then(user => res.send({ data: user }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.updateUserInformation = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {name: `${req.body.name}`, about: `${req.body.about}`},
    {new: true,
    runValidators: true}
  )
  .then(user => res.send({ data: user }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.updateUserAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {avatar: `${req.body.link}`},
    {new: true,
    runValidators: true}
  )
  .then(user => res.send({ data: user }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};