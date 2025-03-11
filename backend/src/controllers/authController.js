const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createUser, findUserByEmail } = require("../models/userModel");
const config = require("../utils/config");

const register = async (req, res) => {
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
    logger.info(`Created new user with username '${username}'`);
  } catch (err) {
    res.status(500).json({
      error: "Error inserting user record to database",
      subError: err.message,
    });
    logger.error(err.message);
  }
};

const login = async (req, res) => {
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
    logger.error(err.message);
  }
};

module.exports = {
  register,
  login,
};
