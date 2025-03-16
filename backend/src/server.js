const express = require("express");
const cors = require("cors");
const config = require("./utils/config");
const logger = require("./utils/logger");
const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const authRoutes = require("./routes/auth");
const notesRoutes = require("./routes/notes");
const categoryRoutes = require("./routes/categories");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/categories", categoryRoutes);

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
