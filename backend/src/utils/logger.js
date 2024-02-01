const fs = require('fs');
const path = require('path');

/**
 * Logs a message to a specific API log file within a date-specific directory.
 *
 * @param {string} message - The message to log.
 * @param {string} reportType - The report type, used in naming the log file.
 */
function logAndCollect(message, reportType) {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  const localISOTime = new Date(now - offset).toISOString();

  const formattedDate = localISOTime.slice(0, 10).replace(/-/g, '');

  const logDirectoryName = path.join(
    '/Users/hugoganet/Code/MGHWebApp/mgh_web_app/backend/src/integrations/sp_api/logs',
    formattedDate,
  );
  const logFileName = `log_${reportType}_${formattedDate}.txt`;
  const logFilePath = path.join(logDirectoryName, logFileName);

  if (!fs.existsSync(logDirectoryName)) {
    fs.mkdirSync(logDirectoryName, { recursive: true });
  }

  const logMessage = `[${localISOTime}] ${message}\n\n`;

  fs.appendFileSync(logFilePath, logMessage, 'utf8');
}

module.exports = { logAndCollect };
