const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { celebrate, Joi } = require("celebrate");
const { errors } = require("celebrate");
const {
  login,
  createUser,
} = require("./controllers/users");

const { auth } = require("./middlewares/auth");

const { ERROR_USER } = require("./constants/constants");

const { PORT = 3000 } = process.env;
const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true, useUnifiedTopology: true,
});

app.post("/signin", celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ minDomainSegments: 3, tlds: { allow: ["com", "net", "ru"] } }),
    password: Joi.string().required(),
  }),
}), login);

app.post("/signup", celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/),
    email: Joi.string().required().email({ minDomainSegments: 3, tlds: { allow: ["com", "net", "ru"] } }),
    password: Joi.string().required(),
  }),
}), createUser);

app.use("/users", auth, require("./routes/users"));
app.use("/cards", auth, require("./routes/cards"));

app.use((req, res) => {
  res.status(ERROR_USER).send({ message: "Такого запроса не существует" });
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? "На сервере произошла ошибка"
        : message,
    });

  next();
});

app.listen(PORT, () => {
  console.log(`${PORT}`);
});
