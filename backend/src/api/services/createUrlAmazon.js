const {
  mapSalesChannelOrCountryCode,
} = require('../../utils/mapSalesChannelOrCountryCode');

/**
 * @description Creates an Amazon URL based on the ASIN and country code
 * @function createUrlAmazon
 * @param {string} asin - Amazon Standard Identification Number
 * @param {string} countryCode - Country code associated with the ASIN
 * @param {boolean} createLog - Whether to create a log for this operation
 * @return {string} - Amazon URL
 */
async function createUrlAmazon(asin, countryCode, createLog = false) {
  let marketplaceDomain;
  let urlAmazon;

  try {
    marketplaceDomain = await mapSalesChannelOrCountryCode(
      countryCode,
      'countryCodeToMarketplaceDomain',
      (createLog = false),
    );
    if (marketplaceDomain) {
      marketplaceDomain = marketplaceDomain.toLowerCase();
      urlAmazon = `https://${marketplaceDomain}/dp/${asin}`;
    } else {
      logMessage += `Marketplace domain not found for country code ${countryCode}\n`;
    }
  } catch (error) {
    logMessage += `Error in createUrlAmazon. Url not created ${error}\n`;
    throw new Error(`Error in createUrlAmazon. Url not created ${error}`);
  } finally {
    if (createLog) {
      logAndCollect(logMessage, 'createUrlAmazon');
    }
  }
  return urlAmazon;
}

module.exports = { createUrlAmazon };
