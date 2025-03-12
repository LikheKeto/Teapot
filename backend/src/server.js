const express = require("express");
const cors = require("cors");
const config = require("./utils/config");
const pool = require("./db");
const logger = require("./utils/logger");

const authRoutes = require("./routes/auth");
const notesRoutes = require("./routes/notes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

app.get("/status", (req, res) => {
  const status = {
    status: "Running",
  };

  res.send(status);
});

const server = app.listen(config.port, () => {
  logger.info(`Server is running on port ${config.port}`);
});

module.exports = server;
