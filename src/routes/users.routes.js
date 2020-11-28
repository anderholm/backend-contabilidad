const { Router } = require("express");
const {
  getUsers,
  createUser,
  getUserById,
  deleteUser,
  updateUser,
  profileUser,
  loginUser,
} = require("../controllers/users.controller");
const router = Router();

const { verifyToken, moderatorMiddleware, adminMiddleware } = require("../middlewares/authjwt");

router.get("/", [verifyToken, moderatorMiddleware], getUsers);
router.get("/profile", verifyToken, profileUser);
router.post("/login", loginUser);
router.post("/", createUser);
router.get("/:id", verifyToken, getUserById);
router.delete("/:id", [verifyToken, adminMiddleware], deleteUser);
router.patch("/:id", verifyToken, updateUser);

module.exports = router;
