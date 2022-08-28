const User = require('../models/user');

module.exports.getAllUsers = (req, res) => {
    User.find({})
    .then(user => res.send({ data: user }))
    .catch((e) => res.status(500).send({ message: 'Произошла ошибка', ...e }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params._id)
  .then((user) => {
    if (user) {
      res.send({ data: user });
      return;
    }
    res.status(404).send({message: 'Пользователь не найден'});
  })
  .catch((e) => res.status(500).send({ message: 'Произошла ошибка', ...e }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
  .then(user => res.send({ data: user }))
  .catch((e) => {
    if(e.name === "ValidationError" || e.link === "ValidationError") {
      res.status(404).send({message: `Переданы некорректные данные в метод создания пользователя`});
      return;
    }
    res.status(500).send({ message: 'Произошла ошибка', ...e  })
  });
};

module.exports.updateUserInformation = async (req, res) => {
  console.log(JSON.stringify(req.body));
  if(req.body.name && req.body.about) {
    await User.findByIdAndUpdate(
      req.user._id,
      {name: `${req.body.name}`, about: `${req.body.about}`},
      {new: true,
      runValidators: true}
    )
    .then(user => res.send({ data: user }))
    .catch((e) => {
      console.log(e);
      res.status(500).send({ message: 'Произошла ошибка', ...e  })
    });
  }
  res.status(400).send({message: 'Переданы некорректные для обновления'});
};

module.exports.updateUserAvatar = (req, res) => {
  if(req.body.link) {
    User.findByIdAndUpdate(
      req.user._id,
      {avatar: `${req.body.link}`},
      {new: true,
      runValidators: true}
    )
    .then(user => res.send({ data: user }))
    .catch((e) => res.status(500).send({ message: 'Произошла ошибка', ...e  }));
  }
  res.status(400).send({message: 'Переданы некорректные для обновления'});
};