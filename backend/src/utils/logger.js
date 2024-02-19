const fs = require('fs');
const path = require('path');

// Global buffer to store log messages temporarily
let logBuffer = [];

/**
 * Adds a log message to the in-memory buffer with a call stack identifier for sorting.
 *
 * @param {string} message - The message to log.
 * @param {string} logContext - The context of the log, used for file naming.
 * @param {string} [callStackIdentifier=''] - An optional string representing the call stack order for sorting purposes.
 * @param {boolean} flushBuffer - Indicates if the log buffer should be flushed after adding the log message.
 */
function bufferedLogger(
  message,
  logContext,
  callStackIdentifier = '',
  flushBuffer = false,
) {
  const now = new Date();
  // Push a new log entry with its context and identifier into the buffer
  logBuffer.push({
    timestamp: now,
    callStackIdentifier,
    message,
    logContext,
  });

  if (flushBuffer) {
    flushLogBuffer();
  }
}

/**
 * Sorts the buffered log entries by their call stack identifier and writes them to files.
 * This ensures log entries are written in the logical order of operations.
 */
function flushLogBuffer() {
  // Sort log entries by callStackIdentifier to maintain logical order
  logBuffer.sort((a, b) => {
    // Ensure both identifiers are strings to avoid errors
    const idA = String(a.callStackIdentifier);
    const idB = String(b.callStackIdentifier);

    return idA.localeCompare(idB);
  });

  // Process and write each log entry to its respective file
  logBuffer.forEach(logEntry => {
    const logEntryString = formatLogEntry(logEntry);
    writeLogToFile(logEntryString, logEntry.logContext, logEntry.timestamp);
  });

  // Clear the buffer after flushing
  logBuffer = [];
}

/**
 * @description Formats a log entry into a string, including its timestamp and call stack identifier.
 *
 * @param {Object} logEntry - The log entry object.
 * @return {string} The formatted log entry string.
 */
function formatLogEntry({ timestamp, callStackIdentifier, message }) {
  const formattedDate = timestamp.toISOString();
  return `[${formattedDate}]${
    callStackIdentifier ? ` [${callStackIdentifier}]` : ''
  } ${message}\n\n`;
}

/**
 * @description Writes a formatted log entry string to a file based on the log context and date.
 *
 * @param {string} logEntry - The formatted log entry string.
 * @param {string} logContext - The log context for directory and file naming.
 * @param {Date} timestamp - The timestamp used for the date-specific directory.
 */
function writeLogToFile(logEntry, logContext, timestamp) {
  const formattedDate = timestamp.toISOString().slice(0, 10).replace(/-/g, '');
  const logDirectoryName = path.join(
    '/Users/hugoganet/Code/MGHWebApp/mgh_web_app/backend/src/integrations/sp_api/logs',
    formattedDate,
  );
  const logFileName = `log_${logContext}_${formattedDate}.txt`;
  const logFilePath = path.join(logDirectoryName, logFileName);

  // Ensure the log directory exists
  if (!fs.existsSync(logDirectoryName)) {
    fs.mkdirSync(logDirectoryName, { recursive: true });
  }

  // Append the log entry to its file
  fs.appendFileSync(logFilePath, logEntry, 'utf8');
}

// Export the bufferedLogger function as the primary logging interface
module.exports = {
  logger: bufferedLogger,
  flushLogBuffer,
};
