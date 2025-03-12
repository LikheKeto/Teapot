const { Pool } = require("pg");
const config = require("./utils/config");

const useTestDb = process.env.NODE_ENV === "test";

const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: useTestDb ? config.db.testDatabase : config.db.database,
});

module.exports = pool;
