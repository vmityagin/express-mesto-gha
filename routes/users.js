const router = require("express").Router();
const {
  getAllUsers,
  getUser,
  createUser,
  updateUserInformation,
  updateUserAvatar,
} = require("../controllers/users");

router.get("/", getAllUsers);
router.get("/:userId", getUser);
router.post("/", createUser);
router.patch("/me", updateUserInformation);
router.patch("/me/avatar", updateUserAvatar);

module.exports = router;
