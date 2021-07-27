const log4js = require("log4js");
const { CHAINS } = require("./envvars");

const logLevel = process.env.LOG_LEVEL || "debug";
const isProduction = process.env.NODE_ENV === "production";
const chain = process.env.CHAIN || CHAINS.STATEMINE;

const scanFileCategory = "block-scan";

log4js.configure({
  appenders: {
    [scanFileCategory]: { type: "file", filename: `log/${chain}/scan.log` },
    errorFile: {
      type: "file",
      filename: `log/${chain}/errors.log`,
    },
    errors: {
      type: "logLevelFilter",
      level: "ERROR",
      appender: "errorFile",
    },
    out: { type: "stdout" },
  },
  categories: {
    default: {
      appenders: [isProduction ? scanFileCategory : "out", "errors"],
      level: logLevel,
    },
  },
});

const logger = log4js.getLogger(scanFileCategory);

module.exports = {
  logger,
};
