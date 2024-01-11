const fs = require('fs');
const path = require('path');

/**
 * Logs a message to a specific API log file based on report type and timestamp.
 *
 * @param {string} message - The message to log.
 * @param {string} reportType - The report type, used in naming the log file.
 */
function logAndCollect(message, reportType) {
  const timeStamp = new Date().toISOString();
  const formattedTimeStamp =
    timeStamp.slice(0, 4) + timeStamp.slice(5, 7) + timeStamp.slice(8, 10);
  const logFileName = `log_${reportType}_${formattedTimeStamp}.txt`;
  const logFilePath = path.join(__dirname, logFileName);

  // Ensure the 'logs' directory exists
  if (!fs.existsSync(path.dirname(logFilePath))) {
    fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
  }

  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n\n`;

  // Append the message to the log file
  fs.appendFileSync(logFilePath, logMessage, 'utf8');
}

module.exports = { logAndCollect };
