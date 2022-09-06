const jwt = require("jsonwebtoken");
const { ERROR_VALID } = require("../constants/constants");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(ERROR_VALID)
      .send({ message: "Необходима авторизация" });
  }
  const token = authorization.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(token, "14-pr-yandex-praktikum-cohort-43");
  } catch (e) {
    return res
      .status(ERROR_VALID)
      .send({ message: "Необходима авторизация" });
  }
  req.user = payload;
  return next();
};
