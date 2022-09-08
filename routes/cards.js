const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const {
  getAllCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
} = require("../controllers/cards");

router.get("/", getAllCards);

router.post("/", celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/),
  }),
}), createCard);

router.delete("/:cardId", celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), deleteCard);
router.put("/:cardId/likes", celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), putLike);

router.delete("/:cardId/likes", celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), deleteLike);

module.exports = router;
