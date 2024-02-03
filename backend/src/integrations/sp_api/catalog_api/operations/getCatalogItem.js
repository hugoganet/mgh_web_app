const { spApiInstance } = require('../../connection/spApiConnector');
const { logAndCollect } = require('../../../../utils/logger');

/**
 * Retrieves catalog item details for the specified ASIN and marketplace.
 * @async
 * @param {string} asin - The ASIN of the catalog item.
 * @param {string} marketplaceId - The marketplace identifier.
 * @param {boolean} createLog - Whether to create a log of the process.
 * @return {Promise<Object>} - The catalog item details.
 */
async function getCatalogItem(asin, marketplaceId, createLog = false) {
  let logMessage = `Fetching catalog item for ASIN: ${asin} and marketplaceId: ${marketplaceId} \n`;
  const includedData = [
    'attributes',
    'productTypes',
    'salesRanks',
    'images',
    'summaries',
  ];
  const apiOperation = 'getCatalogItem';
  const endpoint = `/catalog/2020-12-01/items/${asin}`;
  const queryParams = {
    marketplaceIds: marketplaceId,
    includedData: includedData.join(','),
  };

  try {
    const response = await spApiInstance.sendRequest(
      'GET',
      endpoint,
      queryParams,
      {},
      createLog,
      apiOperation,
      false,
      (rateLimitConfig = { rate: 2, burst: 2 }),
    );
    logMessage += `Catalog item fetched successfully \n`;
    return response.data;
  } catch (error) {
    console.error(`Error in getCatalogItem: ${error}`);
    logMessage += `Error in getCatalogItem: ${error}\n`;
    throw new Error(`Error in getCatalogItem: ${error}`);
  } finally {
    if (createLog) {
      logAndCollect(logMessage, apiOperation);
    }
  }
}

module.exports = { getCatalogItem };
