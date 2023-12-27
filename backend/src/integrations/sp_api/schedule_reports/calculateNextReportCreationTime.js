/**
 * Calculates the next report creation time based on a specific time.
 * If the specified time is later today, it will return today's date with that time.
 * If the specified time has already passed today, it will return tomorrow's date with that time.
 *
 * @param {string} time - The desired time for the next report creation in "HH:mm:ss" format.
 * @return {string} The next report creation time in "yyyyMMdd'T'HHmmss'Z'" format.
 */
function calculateNextReportCreationTime(time) {
  const now = new Date();
  const [hours, minutes, seconds] = time.split(':').map(Number);
  const targetTime = new Date(now);
  targetTime.setHours(hours, minutes, seconds, 0);

  // If the target time has already passed today, move it to the next day
  if (targetTime <= now) {
    targetTime.setDate(targetTime.getDate() + 1);
  }

  return targetTime.toISOString().replace(/[:-]|\.\d{3}/g, '');
}

module.exports = calculateNextReportCreationTime;
