// Wrapper around winston some default settings
// and the ability to set logging level and basic loggers from environment variables
import winston from 'winston';
import constants from '../constants';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
  trace: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  debug: 'blue',
  trace: 'purple',
};

const stringFormatter = (options) => {
  const messagePieces = [options.timestamp(), options.level.toUpperCase(), (options.message || '')];

  if (options.meta.stack) {
    messagePieces.push('<<');
    messagePieces.push(JSON.stringify(options.meta.stack));
    messagePieces.push('>>');
  }

  return messagePieces.join(' ');
};

// Create default winston configuration
const getDefaultConfig = () => {
  const logLevel = process.env.LOGGING_LEVEL ||
    (constants.IS_PRODUCTION ? 'info' : 'trace');
  const format = process.env.LOGGING_FORMATTER || 'string';
  const jsonStringify = (format === 'json')
    ? obj => JSON.stringify(obj) : undefined;
  const formatStrategy = (format === 'json')
    ? undefined // winston logger uses own formatter when using json
    : stringFormatter;

  return {
    levels,
    colors,
    transports: [
      new (winston.transports.Console)({
        json: format === 'json',
        level: logLevel,
        prettyPrint: false,
        colorize: true,
        silent: false,
        handleExceptions: true,
        humanReadableUnhandledException: false,
        timestamp() {
          return new Date().toISOString();
        },
        formatter: formatStrategy,
        stringify: jsonStringify,
      }),
    ],
  };
};

// Use configureLogger defined in the appConfig or user defaults
const loggingConfig = typeof constants.APP_CONFIG.configureLogger === 'function' ?
  constants.APP_CONFIG.configureLogger(getDefaultConfig()) :
  getDefaultConfig();

(loggingConfig.transports || []).forEach((transport) => {
  // Most transports expose 'name' on the prototype, use that otherwise the type is 'unknown'
  console.log(`Adding logging transport of type: [${transport.name || 'unknown'}] at level: [${transport.level}]`);
});

export default new (winston.Logger)(loggingConfig);
