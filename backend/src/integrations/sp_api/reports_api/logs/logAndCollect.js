const fs = require('fs');
const path = require('path');

const apiLogFilePath = path.join(__dirname, 'api_log.txt');

/**
 * @param {*} message
 * @description Logs a message to the console and appends it to the API log file.
 */
function logAndCollect(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n\n`;

  fs.appendFileSync(apiLogFilePath, logMessage, 'utf8');
}

module.exports = { logAndCollect };
