const User = require('../models/user');

module.exports.getAllUsers = (req, res) => {
    User.find({})
    .then(user => res.status(200).send({ data: user }))
    .catch((e) => res.status(500).send({ message: 'Произошла ошибка', ...e }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params._id)
  .then((user) => {
    if (user) {
      res.status(200).send({ data: user });
      return;
    }
    res.status(404).send({message: 'Пользователь не найден'});
  })
  .catch((e) => res.status(500).send({ message: 'Произошла ошибка', ...e }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
  .then(user => res.status(200).send({ data: user }))
  .catch((e) => {
    if(e.name === "ValidationError" || e.link === "ValidationError") {
      res.status(400).send({message: `Переданы некорректные данные в метод создания пользователя`});
      return;
    }
    res.status(500).send({ message: 'Произошла ошибка', ...e  })
  });
};

module.exports.updateUserInformation = async (req, res) => {
  try {
    if(req.body.name && req.body.about) {
       await User.findByIdAndUpdate(
        req.user._id,
        {name: `${req.body.name}`, about: `${req.body.about}`},
        {new: true}
      )
      .then(user => res.status(200).send({ data: user }))
      .catch((e) => {
        if (e.kind === 'ObjectId') {
          return res.status(404).send({ message: 'Пользователь с таким id не найден' });
        }
        return res.status(500).send({ message: 'Произошла ошибка', ...e  });
      });
    } throw (new Error('Ошибка!'))
  } catch(e) {
    return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.', ...e  });
  }
};

module.exports.updateUserAvatar = async (req, res) => {
  try {
    if(req.body.link) {
      await User.findByIdAndUpdate(
        req.user._id,
        {avatar: `${req.body.link}`},
        {new: true}
      )
      .then(user => res.status(200).send({ data: user }))
      .catch((e) => {
        if (e.kind === 'ObjectId') {
          return res.status(404).send({ message: 'Пользователь с таким id не найден' });
        }
        return res.status(500).send({ message: 'Произошла ошибка', ...e  });
      });
    } throw (new Error('Ошибка!'))
  } catch(e) {
    return res.status(400).send({message: 'Переданы некорректные для обновления'});
  }
};