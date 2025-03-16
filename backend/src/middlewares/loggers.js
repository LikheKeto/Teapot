const logger = require("../utils/logger");

const requestLogger = (req, res, next) => {
  logger.info({
    message: "Incoming request",
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    // headers: req.headers,
    // body: req.body,
  });

  //   res.on("finish", () => {
  //     logger.info({
  //       message: "Outgoing response",
  //       statusCode: res.statusCode,
  //       statusMessage: res.statusMessage,
  //       //   headers: res.getHeaders(),
  //     });
  //   });

  next();
};

const errorLogger = (err, req, res, next) => {
  logger.error({
    message: "Error occurred",
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    headers: req.headers,
    body: req.body,
  });

  next(err);
};

module.exports = { requestLogger, errorLogger };
