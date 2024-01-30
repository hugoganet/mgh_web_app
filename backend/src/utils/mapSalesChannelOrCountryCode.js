const db = require('../api/models/index');
const { logAndCollect } = require('../integrations/sp_api/logs/logger');

/**
 * Maps sales channel to country code or country code to marketplace domain.
 * @param {string} input - The sales channel domain or country code.
 * @param {'salesChannelToCountryCode' | 'countryCodeToMarketplaceDomain'} mapType - The type of mapping.
 * @param {boolean} createLog - Whether to create a log entry.
 * @return {Promise<string|null>} - The corresponding country code or marketplace domain, or null if not found.
 */
async function mapSalesChannelOrCountryCode(input, mapType, createLog = false) {
  let logMessage = 'Starting mapSalesChannelOrCountryCode\n';
  try {
    let query = {};

    if (mapType === 'salesChannelToCountryCode') {
      query = { countryMarketplaceDomain: input };
    } else if (mapType === 'countryCodeToMarketplaceDomain') {
      query = { countryCode: input };
    } else {
      throw new Error('Invalid mapType parameter');
    }

    const countryRecord = await db.Country.findOne({ where: query });

    if (countryRecord) {
      if (mapType === 'salesChannelToCountryCode') {
        logMessage += `Found country code ${countryRecord.countryCode} for sales channel ${input}\n`;
        return countryRecord.countryCode;
      } else {
        logMessage += `Found marketplace domain ${countryRecord.countryMarketplaceDomain} for country code ${input}\n`;
        return countryRecord.countryMarketplaceDomain;
      }
    } else {
      logMessage += `No country record found for ${input}\n`;
      return null;
    }
  } catch (error) {
    logMessage += `Error in mapSalesChannelOrCountryCode: ${error}\n`;
    console.error('Error in mapSalesChannelOrCountryCode:', error);
    return null;
  } finally {
    if (createLog) {
      logAndCollect(logMessage, 'mapSalesChannelOrCountryCode');
    }
  }
}

module.exports = { mapSalesChannelOrCountryCode };

mapSalesChannelOrCountryCode('TR', 'countryCodeToMarketplaceDomain', true);
