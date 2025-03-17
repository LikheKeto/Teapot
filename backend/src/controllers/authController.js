const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const {
  createUser,
  findUserByEmail,
  declareVerified,
  checkStatus,
} = require("../models/userModel");
const config = require("../utils/config");
const logger = require("../utils/logger");
const {
  loginConstraints,
  registerConstraints,
  verifyConstraints,
} = require("../utils/constraints");
const validate = require("validate.js");
const { sendVerificationMail } = require("../utils/mail");

const registerHandler = async (req, res) => {
  const { username, email, password } = req.body;

  const registerInput = { username, email, password };
  const validationFailed = validate(registerInput, registerConstraints);
  if (validationFailed) {
    return res.status(400).json({ error: validationFailed });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = crypto.randomBytes(20).toString("hex");

  try {
    const { existing, pendingApproval } = await checkStatus(email);
    if (existing) {
      return res.status(409).json({
        error: { email: `User with this email already exists` },
      });
    } else if (pendingApproval) {
      return res.status(409).json({
        error: {
          email: `This email is unverified, click email link to verify`,
        },
      });
    }

    const encodedEmail = encodeURIComponent(email);
    const verificationLink = `http://localhost:5173/verification?token=${verificationToken}&email=${encodedEmail}`;

    const user = await createUser(
      username,
      email,
      hashedPassword,
      verificationToken
    );
    await sendVerificationMail(email, verificationLink, username);
    logger.info(`Email verification email sent to: '${email}'`);

    delete user.verificationToken;
    res.status(201).json(user);
    logger.info(`Unverified user registered: '${email}'`);
  } catch (err) {
    logger.error(`Registration error for email: ${email}`, {
      error: err.message,
      stack: err.stack,
    });
    if (err.code === "23505") {
      const field = err.constraint?.includes("username")
        ? "username"
        : err.constraint?.includes("email")
        ? "email"
        : null;
      if (field) {
        return res.status(409).json({
          error: { [field]: `User with this ${field} already exists` },
        });
      } else {
        return res.status(409).json({ error: { general: "Duplicate entry" } });
      }
    }
    res.status(500).json({ error: err.message });
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
    if (
      !user ||
      !(await bcrypt.compare(password, user.password)) ||
      (user && !user.verified)
    ) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.id }, config.jwtSecret, {
      expiresIn: "24h",
    });
    res.json({ token });
  } catch (err) {
    logger.error(`Login error for email: ${email}`, {
      error: err.message,
      stack: err.stack,
    });
    res.status(500).json({ error: err.message });
  }
};

const verifyHandler = async (req, res) => {
  const { email, token } = req.body;

  const verifyInput = { email, token };
  const validationFailed = validate(verifyInput, verifyConstraints);
  if (validationFailed) {
    return res.status(400).json({ error: validationFailed });
  }

  try {
    const user = await findUserByEmail(email);
    if (!user || (user && user.verified)) {
      return res
        .status(400)
        .json({ error: "User doesn't exist or is already verified" });
    }
    if (user.verificationToken != token) {
      return res.status(400).json({ error: "Invalid token" });
    }

    const finalUser = await declareVerified(email);
    res.status(200).json(finalUser);
    logger.info(`User email verified: '${email}'`);
  } catch (e) {
    logger.error(`Verification error for email: ${email}`, {
      error: err.message,
      stack: err.stack,
    });
  }
};

module.exports = {
  registerHandler,
  loginHandler,
  verifyHandler,
};
