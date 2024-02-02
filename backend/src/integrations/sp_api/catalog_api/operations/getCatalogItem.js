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
  let logMessage = `Starting getCatalogItem for asin : ${asin}\n`;
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
    );
    logMessage += `Catalog item fetched successfully ${JSON.stringify(
      response.data,
      '',
      2,
    )}.\n`;
    return response.data;
  } catch (error) {
    console.error(`Error in getCatalogItem: ${error}`);
    logMessage += `Error in getCatalogItem: ${error}\n`;
    logMessage += response;
    throw new Error(`Error in getCatalogItem: ${error}`);
  } finally {
    if (createLog) {
      logAndCollect(logMessage, apiOperation);
    }
  }
}

module.exports = { getCatalogItem };
