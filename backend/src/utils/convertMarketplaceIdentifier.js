const marketplaces = require('../config/marketplaces');
const { logger } = require('./logger');

/**
 * Retrieves the country code from a given marketplaceId or the marketplaceId from a given country code.
 * @param {string} identifier - The marketplaceId or countryCode for which the conversion is needed.
 * @param {string} type - The type of conversion to perform ('marketplaceIdToCountryCode' or 'countryCodeToMarketplaceId').
 * @param {boolean} createLog - Whether to create a log of the process.
 * @param {string} logContext - The context for the log message.
 * @return {string|null} - The converted value (country code or marketplaceId) or null if not found.
 */
function convertMarketplaceIdentifier(
  identifier,
  type,
  createLog = false,
  logContext = 'convertMarketplaceIdentifier',
) {
  if (
    !identifier ||
    !['marketplaceIdToCountryCode', 'countryCodeToMarketplaceId'].includes(type)
  ) {
    const logMessage = `Invalid identifier or type provided: ${identifier}, ${type}`;
    console.error(logMessage);
    if (createLog) {
      logger(logMessage, logContext);
    }
    return null;
  }

  try {
    let result = null;

    // Iterate through the country objects within the marketplaces object
    Object.keys(marketplaces).forEach(countryKey => {
      const country = marketplaces[countryKey];
      if (
        type === 'marketplaceIdToCountryCode' &&
        country.marketplaceId === identifier
      ) {
        result = country.countryCode;
      } else if (
        type === 'countryCodeToMarketplaceId' &&
        country.countryCode === identifier
      ) {
        result = country.marketplaceId;
      }
    });

    if (result === null) {
      const logMessage = `No matching value found for identifier: ${identifier} with type: ${type}`;
      console.error(logMessage);
      if (createLog) {
        logger(logMessage, logContext);
      }
    }

    return result;
  } catch (error) {
    const logMessage = `Error in convertMarketplaceIdentifier: ${error.message}`;
    console.error(logMessage);
    if (createLog) {
      logger(logMessage, logContext);
    }
    throw error;
  }
}

module.exports = {
  convertMarketplaceIdentifier,
};
