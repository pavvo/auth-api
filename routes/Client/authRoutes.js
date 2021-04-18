const { Router } = require("express");
const authController = require("../../controllers/Client/authController");

const router = Router();

// Test index route
router.get("/", (req, res) => res.send("hello from client"));

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/verify/:uniqueString", authController.verify);

module.exports = router;
