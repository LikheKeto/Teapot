const { Pool } = require("pg");
const config = require("./utils/config");

console.log(config.dbUrl);

const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
});

module.exports = pool;
