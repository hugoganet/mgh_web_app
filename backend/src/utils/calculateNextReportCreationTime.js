/**
 * Calculates the next time a report should be created based on a given time.
 * If the specified time is in the future for today, it returns today's date with that time.
 * If the specified time has already passed for today, it returns tomorrow's date with that time.
 * Throws an error if the input time format is invalid.
 *
 * @param {string} time - Desired time for report creation in "HH:mm:ss" format.
 * @return {string} Next report creation time in "yyyyMMdd'T'HHmmss'Z'" format.
 */
function calculateNextReportCreationTime(time) {
  try {
    // Validate input time format
    if (!/^\d{2}:\d{2}:\d{2}$/.test(time)) {
      throw new Error('Invalid time format. Expected format is HH:mm:ss.');
    }

    // Current date and time
    const now = new Date();

    // Target time set for today with the specified hours, minutes, and seconds
    const targetTime = new Date();
    targetTime.setHours(...time.split(':').map(Number), 0);

    // Adjust to the next day if the specified time has already passed
    if (targetTime <= now) {
      targetTime.setDate(now.getDate() + 1);
    }

    // Format and return the target time
    return targetTime.toISOString();
  } catch (error) {
    console.error(
      'Error calculating next report creation time:',
      error.message,
    );
    throw error; // Re-throw the error to be handled by the caller
  }
}

module.exports = calculateNextReportCreationTime;
