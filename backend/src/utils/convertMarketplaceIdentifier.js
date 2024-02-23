const marketplaces = require('../config/marketplaces'); // Adjust the path as necessary
const { logger } = require('./logger');

/**
 * Converts between marketplace identifiers, country codes, and sales channels.
 * @param {string} identifier - The identifier to be converted (marketplaceId, countryCode, or domain).
 * @param {boolean} createLog - Whether to create a log of the process.
 * @param {string} logContext - The context for the log message.
 * @return {string|null} - The converted value or null if not found.
 */
function convertMarketplaceIdentifier(
  identifier,
  createLog = false,
  logContext = 'convertMarketplaceIdentifier',
) {
  let identifierType;
  if (identifier.includes('.')) {
    identifierType = 'domain';
  } else if (identifier.length === 2) {
    identifierType = 'countryCode';
  } else {
    identifierType = 'marketplaceId';
  }
  let result = null;

  try {
    const marketplace = Object.values(marketplaces).find(
      m => m[identifierType] === identifier,
    );
    if (!marketplace) {
      throw new Error(`No match found for identifier: ${identifier}`);
    }

    result = {
      countryCode: marketplace.countryCode,
      marketplaceId: marketplace.marketplaceId,
      currencyCode: marketplace.currencyCode,
      domain: marketplace.domain,
      countryName: marketplace.countryName,
    };

    return result;
  } catch (error) {
    console.error(`Error in convertMarketplaceIdentifier`);
    const errorMessage = `Error in convertMarketplaceIdentifier: ${error.message}`;
    if (createLog) {
      logger(errorMessage, logContext);
    }
    throw new Error(errorMessage);
  }
}

module.exports = {
  convertMarketplaceIdentifier,
};
