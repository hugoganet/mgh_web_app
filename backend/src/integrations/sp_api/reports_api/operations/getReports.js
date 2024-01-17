const { spApiInstance } = require('../../connection/spApiConnector');

/**
 * Retrieves report details based on specified filters.
 * @async
 * @param {Object} config - Configuration for fetching reports.
 * @return {Promise<Object>} - Response containing report details.
 */
async function getReports(config) {
  const {
    reportTypes,
    processingStatuses,
    marketplaceIds,
    pageSize,
    createdSince,
    createdUntil,
    nextToken,
    createLog,
  } = config;

  const queryParams = {
    ...(reportTypes && { reportTypes }),
    ...(processingStatuses && { processingStatuses }),
    ...(marketplaceIds && { marketplaceIds }),
    ...(pageSize && { pageSize }),
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
      {},
      createLog,
      apiOperation,
      false,
    );

    return response.data;
  } catch (error) {
    console.error(`Error in getReports: ${error}`);
    throw error;
  }
}

module.exports = { getReports };

const config = {
  reportTypes: ['GET_FBA_MYI_UNSUPPRESSED_INVENTORY_DATA'],
  createLog: true,
  pageSize: 100,
  createdSince: '2024-01-15T00:00:00+00:00',
  processingStatuses: 'DONE',
};
getReports(config);
