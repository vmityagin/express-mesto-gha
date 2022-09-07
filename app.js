const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
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

app.post("/signin", login);
app.post("/signup", createUser);

app.use("/users", auth, require("./routes/users"));
app.use("/cards", auth, require("./routes/cards"));

app.use((req, res) => {
  res.status(ERROR_USER).send({ message: "Такого запроса не существует" });
});

app.listen(PORT, () => {
  console.log(`${PORT}`);
});
