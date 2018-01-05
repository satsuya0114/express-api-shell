const winston = require('winston');
const moment = require('moment');
const DailyRotateFile = require('winston-daily-rotate-file');

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp: () => moment().format('YYYY-MM-DD HH:mm:ss.SSSS'),
      formatter: (options) => {
        const formatText = `${options.timestamp()} [${options.level.toUpperCase()}] - ${options.message ? options.message : ''} ${(options.meta && Object.keys(options.meta).length) ? JSON.stringify(options.meta) : ''}`;
        return winston.config.colorize(options.level, formatText);
      },
      colorize: true,
    }),
    new DailyRotateFile({
      filename: './logs/log-',
      createTree: true,
      maxsize: 1024 * 1024 * 10, // 10MB
      datePattern: 'yyyy-MM-dd',
      json: false,
      timestamp: () => moment().format('YYYY-MM-DD HH:mm:ss.SSSS'),
      formatter: options => `${options.timestamp()} [${options.level.toUpperCase()}] - ${options.message ? options.message : ''} ${(options.meta && Object.keys(options.meta).length) ? JSON.stringify(options.meta) : ''}`,
    }),
  ],
});

module.exports = logger;
