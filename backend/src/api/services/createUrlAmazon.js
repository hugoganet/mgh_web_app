const {
  convertMarketplaceIdentifier,
} = require('../../utils/convertMarketplaceIdentifier');
const { logger } = require('../../utils/logger');

/**
 * @description Creates an Amazon URL based on the ASIN and country code
 * @function createUrlAmazon
 * @param {string} asin - Amazon Standard Identification Number
 * @param {string} countryCode - Country code associated with the ASIN
 * @param {boolean} createLog - Whether to create a log for this operation
 * @param {string} logContext - The context for the log message
 * @return {string} - Amazon URL
 */
function createUrlAmazon(
  asin,
  countryCode,
  createLog = false,
  logContext = 'createUrlAmazon',
) {
  let marketplaceDomain;
  let urlAmazon;

  try {
    result = convertMarketplaceIdentifier(countryCode, true, logContext);
    marketplaceDomain = result.domain;

    if (marketplaceDomain) {
      marketplaceDomain = marketplaceDomain.toLowerCase();
      urlAmazon = `https://${marketplaceDomain}/dp/${asin}`;
      return urlAmazon;
    } else {
      throw new Error(
        `Marketplace domain not found for country code ${countryCode}\n`,
      );
    }
  } catch (error) {
    console.log(`Error in createUrlAmazon.`);
    if (createLog) {
      logger(
        `Error in createUrlAmazon for asin: ${asin}. Url not created ${error}\n`,
        logContext,
      );
    }
    throw new Error(`Error in createUrlAmazon. Url not created ${error}`);
  }
}

module.exports = { createUrlAmazon };
