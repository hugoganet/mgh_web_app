const db = require('../api/models/index');

/**
 * Maps sales channel to country code.
 * @param {string} salesChannel - The sales channel domain from the CSV file.
 * @return {Promise<string|null>} - The corresponding country code or null if not found.
 */
async function mapSalesChannelToCountryCode(salesChannel) {
  try {
    // Retrieve the country record with the matching marketplace domain
    const countryRecord = await db.Country.findOne({
      where: { countryMarketplaceDomain: salesChannel },
    });

    // Return the countryCode if the country record is found
    if (countryRecord) {
      return countryRecord.countryCode;
    }

    // Return null or some default code if the country record is not found
    return null;
  } catch (error) {
    console.error('Error mapping sales channel to country code:', error);
    return null; // or handle the error as appropriate
  }
}

module.exports = { mapSalesChannelToCountryCode };
