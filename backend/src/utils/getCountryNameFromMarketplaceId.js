const marketplaces = require('../config/marketplaces'); // Adjust the path as necessary

/**
 * Retrieves the country name from a given marketplaceId.
 * @param {string} marketplaceId - The marketplaceId for which the country name is needed.
 * @return {string|null} - The country name or null if the marketplaceId is not found.
 */
function getCountryNameFromMarketplaceId(marketplaceId) {
  if (!marketplaceId) {
    console.error('No marketplaceId provided');
    return null;
  }

  for (const countryName in marketplaces) {
    if (marketplaces[countryName].marketplaceId === marketplaceId) {
      return countryName;
    }
  }

  console.error(`No country found for marketplaceId: ${marketplaceId}`);
  return null;
}

module.exports = {
  getCountryNameFromMarketplaceId,
};
