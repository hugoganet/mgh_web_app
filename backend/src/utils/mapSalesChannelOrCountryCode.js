const marketplaces = require('../config/marketplaces'); // Adjust the path as necessary
const { logger } = require('../utils/logger');

/**
 * Maps sales channel to country code or country code to marketplace domain using the marketplaces object.
 * @param {string} input - The sales channel domain or country code.
 * @param {'salesChannelToCountryCode' | 'countryCodeToMarketplaceDomain'} mapType - The type of mapping.
 * @param {boolean} createLog - Whether to create a log entry.
 * @param {string} logContext - The context for the log message.
 * @return {string|null} - The corresponding country code or marketplace domain, or null if not found.
 */
async function mapSalesChannelOrCountryCode(
  input,
  mapType,
  createLog = false,
  logContext = 'mapSalesChannelOrCountryCode',
) {
  let result = null;

  try {
    Object.values(marketplaces).forEach(marketplace => {
      if (
        mapType === 'salesChannelToCountryCode' &&
        marketplace.domain === input
      ) {
        result = marketplace.countryCode;
      } else if (
        mapType === 'countryCodeToMarketplaceDomain' &&
        marketplace.countryCode === input
      ) {
        result = marketplace.domain;
      }
    });

    if (!result) {
      throw new Error(
        `Mapping not found for input: ${input} with mapType: ${mapType}`,
      );
    }
    console.log(`Result: ${result}`);
    return result;
  } catch (error) {
    if (createLog) {
      logger(
        `Error in mapSalesChannelOrCountryCode: ${error.message}\n`,
        logContext,
      );
    }
    console.error(`Error in mapSalesChannelOrCountryCode: ${error.message}`);
    throw new Error(`Error in mapSalesChannelOrCountryCode: ${error.message}`);
  }
}

module.exports = { mapSalesChannelOrCountryCode };
