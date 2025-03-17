const pool = require("../db");

const createUser = async (username, email, password, verificationToken) => {
  const result = await pool.query(
    `INSERT INTO users (username, email, password, "verificationToken") VALUES ($1, $2, $3, $4) RETURNING *`,
    [username, email, password, verificationToken]
  );
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return result.rows[0];
};

const declareVerified = async (email) => {
  const result = await pool.query(
    'UPDATE users SET verified = true, "verificationToken"=null WHERE email = $1 returning *',
    [email]
  );
  return result.rows[0];
};

const checkStatus = async (email) => {
  const status = {
    existing: false,
    pendingApproval: false,
  };
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  const user = result.rows[0];
  if (!user) {
    return status;
  } else {
    if (user.verified) {
      status.existing = true;
    } else {
      status.pendingApproval = true;
    }
    return status;
  }
};

module.exports = {
  createUser,
  findUserByEmail,
  declareVerified,
  checkStatus,
};
