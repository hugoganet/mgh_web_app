const marketplaces = require('../config/marketplaces'); // Adjust the path as necessary

/**
 * Retrieves the country code from a given marketplaceId or the marketplaceId from a given country code.
 * @param {string} identifier - The marketplaceId or countryCode for which the conversion is needed.
 * @param {string} type - The type of conversion to perform ('marketplaceIdToCountryCode' or 'countryCodeToMarketplaceId').
 * @return {string|null} - The converted value (country code or marketplaceId) or null if not found.
 */
function convertMarketplaceIdentifier(identifier, type) {
  if (!identifier) {
    console.error('No identifier provided');
    return null;
  }

  for (const key in marketplaces) {
    if (
      type === 'marketplaceIdToCountryCode' &&
      marketplaces[key].marketplaceId === identifier
    ) {
      return marketplaces[key].countryCode;
    } else if (
      type === 'countryCodeToMarketplaceId' &&
      marketplaces[key].countryCode === identifier
    ) {
      return marketplaces[key].marketplaceId;
    }
  }

  console.error(
    `No matching value found for identifier: ${identifier} with type: ${type}`,
  );
  return null;
}

module.exports = {
  convertMarketplaceIdentifier,
};
