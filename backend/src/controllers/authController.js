const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createUser, findUserByEmail } = require("../models/userModel");
const config = require("../utils/config");
const logger = require("../utils/logger");
const {
  loginConstraints,
  registerConstraints,
} = require("../utils/constraints");
const validate = require("validate.js");

const registerHandler = async (req, res) => {
  const { username, email, password } = req.body;

  const registerInput = { username, email, password };
  const validationFailed = validate(registerInput, registerConstraints);
  if (validationFailed) {
    return res.status(400).json({ error: validationFailed });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await createUser(username, email, hashedPassword);
    res.status(201).json(user);
    logger.info(`User registered: '${email}'`);
  } catch (err) {
    res.status(500).json({
      error: "Error registering the user",
      subError: err.message,
    });
    logger.error(`Registration error: ${err.message}`);
  }
};

const loginHandler = async (req, res) => {
  const { email, password } = req.body;

  const loginInput = { email, password };
  const validationFailed = validate(loginInput, loginConstraints);
  if (validationFailed) {
    return res.status(400).json({ error: validationFailed });
  }

  try {
    const user = await findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.id }, config.jwtSecret, {
      expiresIn: "24h",
    });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
    logger.error(`Login error: ${err.message}`);
  }
};

module.exports = {
  registerHandler,
  loginHandler,
};
