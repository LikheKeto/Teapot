const express = require("express");
const {
  loginHandler,
  registerHandler,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerHandler);
router.post("/login", loginHandler);

module.exports = router;
