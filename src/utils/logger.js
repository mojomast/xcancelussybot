/**
 * Logger Utility Module
 * Provides centralized logging with different levels and formatting
 */

const fs = require('fs').promises;
const path = require('path');

// Log levels
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

// Current log level
let currentLogLevel = LOG_LEVELS.INFO;

// Log file path
const LOG_DIR = path.join(process.cwd(), 'logs');
const LOG_FILE = path.join(LOG_DIR, `bot-${new Date().toISOString().split('T')[0]}.log`);

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

// Set log level
function setLogLevel(level) {
  if (typeof level === 'string') {
    level = level.toUpperCase();
    currentLogLevel = LOG_LEVELS[level] ?? LOG_LEVELS.INFO;
  } else {
    currentLogLevel = level;
  }
}

// Format log message
function formatMessage(level, message, data = null) {
  const timestamp = new Date().toISOString();
  const levelStr = level.padEnd(5);

  let formattedMessage = `[${timestamp}] [${levelStr}] ${message}`;

  if (data) {
    if (typeof data === 'object') {
      formattedMessage += `\n${JSON.stringify(data, null, 2)}`;
    } else {
      formattedMessage += ` ${data}`;
    }
  }

  return formattedMessage;
}

// Get console color for level
function getConsoleColor(level) {
  switch (level) {
    case 'ERROR': return colors.red;
    case 'WARN': return colors.yellow;
    case 'INFO': return colors.green;
    case 'DEBUG': return colors.cyan;
    default: return colors.white;
  }
}

// Write to file
async function writeToFile(message) {
  try {
    // Ensure log directory exists
    await fs.mkdir(LOG_DIR, { recursive: true });
    await fs.appendFile(LOG_FILE, message + '\n');
  } catch (error) {
    console.error('Failed to write to log file:', error);
  }
}

// Core logging function
async function log(level, message, data = null) {
  if (LOG_LEVELS[level] > currentLogLevel) return;

  const formattedMessage = formatMessage(level, message, data);

  // Console output with colors
  const color = getConsoleColor(level);
  console.log(`${color}${formattedMessage}${colors.reset}`);

  // File output (always write errors and warnings)
  if (level === 'ERROR' || level === 'WARN' || currentLogLevel >= LOG_LEVELS.INFO) {
    await writeToFile(formattedMessage);
  }
}

// Public logging methods
const logger = {
  error: (message, data) => log('ERROR', message, data),
  warn: (message, data) => log('WARN', message, data),
  info: (message, data) => log('INFO', message, data),
  debug: (message, data) => log('DEBUG', message, data),

  // Utility methods
  setLogLevel,

  // Performance logging
  startTimer: (label) => {
    const start = Date.now();
    logger.debug(`Timer started: ${label}`);
    return {
      stop: () => {
        const duration = Date.now() - start;
        logger.debug(`Timer stopped: ${label} (${duration}ms)`);
        return duration;
      }
    };
  },

  // Request logging
  logRequest: (user, command, success, duration = null) => {
    const message = `${user} executed ${command}`;
    const data = { user, command, success, duration };

    if (success) {
      logger.info(message, data);
    } else {
      logger.error(message, data);
    }
  },

  // System logging
  logSystemEvent: (event, data) => {
    logger.info(`System event: ${event}`, data);
  },

  // User activity logging
  logUserActivity: (user, action, details = null) => {
    logger.debug(`User activity: ${user} - ${action}`, details);
  }
};

// Initialize logger with environment settings
function initializeLogger() {
  const envLogLevel = process.env.LOG_LEVEL || 'info';
  setLogLevel(envLogLevel);

  logger.info('Logger initialized', {
    logLevel: envLogLevel,
    logFile: LOG_FILE
  });
}

module.exports = {
  logger,
  initializeLogger,
  LOG_LEVELS
};