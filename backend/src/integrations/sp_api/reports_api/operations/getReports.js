const { spApiInstance } = require('../../connection/spApiConnector');

/**
 * Retrieves report details based on specified filters and handles pagination using nextToken.
 * @async
 * @param {Object} config - Configuration for fetching reports.
 * @param {Array} accumulatedReports - Accumulator for reports across multiple pages.
 * @param {boolean} createLog - Indicates if the operation should be logged.
 * @param {string} logContext - The context for the log.
 * @param {boolean} flushBuffer - Whether to flush the log buffer.
 * @return {Promise<Object>} - Response containing all report details across pages.
 */
async function getReports(
  config,
  accumulatedReports = [],
  createLog = false,
  logContext = 'getReports',
  flushBuffer = false,
) {
  const {
    reportTypes,
    processingStatuses,
    marketplaceIds,
    pageSize = 100, // Default pageSize if not provided
    createdSince,
    createdUntil,
    nextToken,
  } = config;

  const queryParams = {
    ...(reportTypes && { reportTypes }),
    ...(processingStatuses && { processingStatuses }),
    ...(marketplaceIds && { marketplaceIds }),
    pageSize,
    ...(createdSince && { createdSince }),
    ...(createdUntil && { createdUntil }),
    ...(nextToken && { nextToken }),
  };

  const apiOperation = 'getReports';
  const endpoint = '/reports/2021-06-30/reports';
  const method = 'GET';

  try {
    const response = await spApiInstance.sendRequest(
      method,
      endpoint,
      queryParams,
      (body = {}),
      logContext,
      createLog,
      flushBuffer,
      apiOperation,
      (isGrantless = false),
      (rateLimitConfig = { rate: 0.0222, burst: 10 }),
    );

    // Accumulate the reports
    accumulatedReports.push(...response.data.reports);

    // If there's a nextToken, call getReports recursively with the nextToken
    if (response.data.nextToken) {
      return getReports(
        { ...config, nextToken: response.data.nextToken },
        accumulatedReports,
      );
    }

    // Return all accumulated reports when there are no more pages
    return accumulatedReports;
  } catch (error) {
    console.error(`Error in getReports: ${error}`);
    if (createLog) {
      logger(`Error in getReports: ${error}`, apiOperation, '', flushBuffer);
    }
    throw error;
  }
}

module.exports = { getReports };

// // Example usage
// const config = {
//   reportTypes: ['GET_FBA_MYI_UNSUPPRESSED_INVENTORY_DATA'],
//   createLog: true,
//   pageSize: 100,
//   createdSince: '2024-01-15T00:00:00+00:00',
//   processingStatuses: 'DONE',
// };
// getReports(config);
