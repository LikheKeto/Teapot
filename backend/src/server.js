const express = require("express");
const cors = require("cors");
const config = require("./utils/config");
const pool = require("./db");
const logger = require("./utils/logger");

const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/status", (req, res) => {
  const status = {
    Status: "Running",
  };

  response.send(status);
});

app.listen(config.port, () => {
  logger.info(`Server is running on port ${config.port}`);
});
