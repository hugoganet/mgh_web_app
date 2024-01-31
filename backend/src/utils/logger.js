const fs = require('fs');
const path = require('path');

/**
 * Logs a message to a specific API log file based on report type and local timestamp.
 *
 * @param {string} message - The message to log.
 * @param {string} reportType - The report type, used in naming the log file.
 */
function logAndCollect(message, reportType) {
  // Get the current time
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000; // Convert offset to milliseconds
  const localISOTime = new Date(now - offset).toISOString();

  // Extracting the date for the log file name
  const formattedDate = localISOTime.slice(0, 10).replace(/-/g, '');

  const logFileName = `log_${reportType}_${formattedDate}.txt`;
  const logFilePath = path.join(__dirname, logFileName);

  // Ensure the 'logs' directory exists
  if (!fs.existsSync(path.dirname(logFilePath))) {
    fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
  }

  // Formatted log message with ISO-like date
  const logMessage = `[${localISOTime}] ${message}\n\n`;

  // Append the message to the log file
  fs.appendFileSync(logFilePath, logMessage, 'utf8');
}

module.exports = { logAndCollect };
