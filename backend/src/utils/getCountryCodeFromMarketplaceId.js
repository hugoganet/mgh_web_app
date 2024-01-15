const marketplaces = require('../config/marketplaces'); // Adjust the path as necessary

/**
 * Retrieves the country code from a given marketplaceId.
 * @param {string} marketplaceId - The marketplaceId for which the country code is needed.
 * @return {string|null} - The country code or null if the marketplaceId is not found.
 */
function getCountryCodeFromMarketplaceId(marketplaceId) {
  if (!marketplaceId) {
    console.error('No marketplaceId provided');
    return null;
  }

  for (const key in marketplaces) {
    if (marketplaces[key].marketplaceId === marketplaceId) {
      return marketplaces[key].countryCode;
    }
  }

  console.error(`No country found for marketplaceId: ${marketplaceId}`);
  return null;
}

module.exports = {
  getCountryCodeFromMarketplaceId,
};
