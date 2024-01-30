const { spApiInstance } = require('../../connection/spApiConnector');
const { logAndCollect } = require('../../logs/logger');

/**
 * Retrieves catalog item details for the specified ASIN and marketplace.
 * @async
 * @param {string} asin - The ASIN of the catalog item.
 * @param {string} marketplaceIds - The marketplace identifier.
 * @param {boolean} createLog - Whether to create a log of the process.
 * @return {Promise<Object>} - The catalog item details.
 */
async function getCatalogItem(asin, marketplaceIds, createLog = false) {
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
    marketplaceIds: marketplaceIds,
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

    return response.data;
  } catch (error) {
    console.error(`Error in getCatalogItem: ${error}`);
    if (createLog) {
      logAndCollect(`Error in getCatalogItem: ${error}`, apiOperation);
    }
    throw error;
  }
}

module.exports = { getCatalogItem };

// Example usage
const asin = 'B005LH2FA0';
const marketplaceIds = 'A13V1IB3VIYZZH';
getCatalogItem(asin, marketplaceIds, true)
  .then(itemDetails => console.log(itemDetails))
  .catch(error => console.error(error));
