const marketplaces = require('../utils/marketplaces'); // Adjust the path as necessary
const { logger } = require('./logger');

// Mapping of country codes to marketplace object keys
const countryCodeToKeyMap = {
  FR: 'france',
  DE: 'germany',
  ES: 'spain',
  IT: 'italy',
  NL: 'netherlands',
  BE: 'belgium',
  SE: 'sweden',
  PL: 'poland',
  TR: 'turkey',
  UK: 'unitedKingdom',
};

/**
 * Converts between marketplace identifiers, country codes, and sales channels.
 * @param {string} identifier - The identifier to be converted (marketplaceId, countryCode, or domain).
 * @param {boolean} createLog - Whether to create a log of the process.
 * @param {string} logContext - The context for the log message.
 * @return {Object|null} - The converted value or null if not found.
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
    let marketplace;
    if (identifierType === 'countryCode') {
      const key = countryCodeToKeyMap[identifier];
      marketplace = marketplaces[key];
    } else {
      marketplace = Object.values(marketplaces).find(
        m => m[identifierType] === identifier,
      );
    }

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

    if (createLog) {
      logger(
        `Converted ${identifierType}: ${identifier} to ${JSON.stringify(
          result,
        )}`,
        logContext,
      );
    }

    return result;
  } catch (error) {
    const errorMessage = `Error in convertMarketplaceIdentifier: ${error.message}`;
    if (createLog) {
      logger(errorMessage, logContext);
    }
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
}

module.exports = {
  convertMarketplaceIdentifier,
};
