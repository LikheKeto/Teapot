const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const config = require("../utils/config");
const validate = require("validate.js");
const {
  registerConstraints,
  loginConstraints,
} = require("../utils/constraints");
const logger = require("../utils/logger");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  const registerInput = { username, email, password };
  const validationFailed = validate(registerInput, registerConstraints);
  if (validationFailed) {
    return res.status(400).json({ error: validationFailed });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
      [username, email, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
    logger.info(`Created new user with username '${username}'`);
  } catch (err) {
    res.status(500).json({
      error: "Error inserting user record to database",
      subError: err.message,
    });
    logger.error(err.message);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const loginInput = { email, password };
  const validationFailed = validate(loginInput, loginConstraints);
  if (validationFailed) {
    return res.status(400).json({ error: validationFailed });
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.id }, config.jwtSecret, {
      expiresIn: "24h",
    });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
    logger.error(err.message);
  }
});

module.exports = router;
