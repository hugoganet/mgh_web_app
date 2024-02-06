const { spApiInstance } = require('../../connection/spApiConnector');
const { logger } = require('../../../../utils/logger');

/**
 * Retrieves catalog item details for the specified ASIN and marketplace.
 * @async
 * @param {string} asin - The ASIN of the catalog item.
 * @param {string} marketplaceId - The marketplace identifier.
 * @param {boolean} createLog - Whether to create a log of the process.
 * @return {Promise<Object>} - The catalog item details.
 */
async function getCatalogItem(asin, marketplaceId, createLog = false) {
  const includedData = [
    'attributes',
    'productTypes',
    'salesRanks',
    'images',
    'summaries',
  ];
  const apiOperation = 'getCatalogItem';
  const endpoint = `/catalog/2020-12-01/items/${asin}`;
  const method = 'GET';
  const queryParams = {
    marketplaceIds: marketplaceId,
    includedData: includedData.join(','),
  };

  try {
    const response = await spApiInstance.sendRequest(
      method,
      endpoint,
      queryParams,
      {},
      logContext,
      createLog,
      apiOperation,
      (isGrantless = false),
      (rateLimitConfig = { rate: 2, burst: 2 }),
    );

    return response.data;
  } catch (error) {
    if (createLog) {
      logger(`Error in getCatalogItem: ${error}\n`, logContext);
    }
    console.error(`Error in getCatalogItem`);
    throw new Error(`Error in getCatalogItem: ${error}`);
  }
}

module.exports = { getCatalogItem };
