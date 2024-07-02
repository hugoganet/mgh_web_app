/* eslint-disable require-jsdoc */
const {
  KeepaData,
  FormattedCatalog,
  AsinSourcingCatalog,
} = require('../../database/models/index');

async function fetchData() {
  const keepaData = await KeepaData.findAll();
  const formattedCatalog = await FormattedCatalog.findAll();

  console.log(`Fetched ${keepaData.length} rows from KeepaData`);
  console.log(`Fetched ${formattedCatalog.length} rows from FormattedCatalog`);

  return { keepaData, formattedCatalog };
}

async function processDataIntoAsinSourcingCatalog() {
  const { keepaData, formattedCatalog } = await fetchData();
  const asinSourcingCatalogData = [];

  for (const keepaDataItem of keepaData) {
    const eanList = keepaDataItem.ean.split(',').map(ean => ean.trim());

    console.log(
      `Processing KeepaDataItem with ASIN: ${keepaDataItem.asin} and EANs: ${eanList}`,
    );

    for (const ean of eanList) {
      const formattedCatalogItem = formattedCatalog.find(
        item => item.ean === ean,
      );

      if (formattedCatalogItem) {
        console.log(
          `Match found for EAN: ${ean} in FormattedCatalog with ASIN: ${formattedCatalogItem.asin}`,
        );

        asinSourcingCatalogData.push({
          keepaDataId: keepaDataItem.keepaDataId,
          ean: formattedCatalogItem.ean,
          asin: keepaDataItem.asin,
        });
      } else {
        console.log(`No match found for EAN: ${ean}`);
      }
    }
  }

  console.log('asinSourcingCatalogData:', asinSourcingCatalogData);

  if (asinSourcingCatalogData.length > 0) {
    await AsinSourcingCatalog.bulkCreate(asinSourcingCatalogData, {
      ignoreDuplicates: true,
    });
    console.log(
      `Inserted ${asinSourcingCatalogData.length} rows into AsinSourcingCatalog`,
    );
  } else {
    console.log('No data to insert into AsinSourcingCatalog');
  }

  return asinSourcingCatalogData;
}

module.exports = processDataIntoAsinSourcingCatalog;

if (require.main === module) {
  (async () => {
    try {
      await processDataIntoAsinSourcingCatalog();
      console.log('Data processed successfully');
    } catch (error) {
      console.error('Error processing data:', error);
    }
  })();
}
