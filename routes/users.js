const router = require("express").Router();
const {
  getAllUsers,
  getUser,
  updateUserInformation,
  updateUserAvatar,
} = require("../controllers/users");

router.get("/", getAllUsers);
router.get("/:userId", getUser);
router.patch("/me", updateUserInformation);
router.patch("/me/avatar", updateUserAvatar);

module.exports = router;
