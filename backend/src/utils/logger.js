const winston = require("winston");

const config = {
  levels: {
    error: 0,
    debug: 1,
    warn: 2,
    data: 3,
    info: 4,
    verbose: 5,
    silly: 6,
  },
  colors: {
    error: "red",
    debug: "blue",
    warn: "yellow",
    data: "magenta",
    info: "green",
    verbose: "cyan",
    silly: "grey",
  },
};

winston.addColors(config.colors);
const wLogger = (input) =>
  winston.createLogger({
    levels: config.levels,
    level: `${input.level}`,
    transports: [
      new winston.transports.Console({
        level: `${input.level}`,

        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.printf(
            (info) =>
              `${new Date(info.timestamp).toLocaleDateString("sv-SE", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })} ${info.level.toLocaleUpperCase()}: ${info.message}`
          ),
          winston.format.colorize({ all: true })
        ),
      }),
    ],
  });

module.exports = wLogger({ logName: "NOTE APP", level: "info" });
