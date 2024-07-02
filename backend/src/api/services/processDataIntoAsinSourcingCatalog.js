/* eslint-disable require-jsdoc */
const { KeepaData, FormattedCatalog } = require('../../database/models/index');

async function fetchData() {
  const keepaData = await KeepaData.findAll();
  const formattedCatalog = await FormattedCatalog.findAll();
  return { keepaData, formattedCatalog };
}

async function processDataIntoAsinSourcingCatalog() {
  const { keepaData, formattedCatalog } = await fetchData();
  const asinSourcingCatalogData = keepaData.map((keepaDataItem, index) => {
    const formattedCatalogItem = formattedCatalog[index];
    return {
      keepaDataId: keepaDataItem.keepaDataId,
      ean: formattedCatalogItem.ean,
      // productCategoryRank: keepaDataItem.productCategoryRank,
      // averageSellingPriceInc: keepaDataItem.averageSellingPriceInc,
      // estimAsinAcquisitionCostExc: keepaDataItem.estimAsinAcquisitionCostExc,
      // estimAsinAcquisitionCostInc: keepaDataItem.estimAsinAcquisitionCostInc,
      // minimumSellingPriceLocalAndPanEu: keepaDataItem.minimumSellingPriceLocalAndPanEu,
      // minimumSellingPriceEfn: keepaDataItem.minimumSellingPriceEfn,
      // estimMonthlyRevenu: keepaDataItem.estimMonthlyRevenu,
      // estimMonthlyMarginExc: keepaDataItem.estimMonthlyMarginExc,
      // estimAcquisitionCostExc: keepaDataItem.estimAcquisitionCostExc,
      // estimPersonalMonthlyQuantitySold: keepaDataItem.estimPersonalMonthlyQuantitySold,
      // pvMoyenConstate: keepaDataItem.pvMoyenConstate,
      // fbaFees: keepaDataItem.fbaFees,
      // prepFees: keepaDataItem.prepFees,
      // transportFees: keepaDataItem.transportFees,
      // isHazmat: keepaDataItem.isHazmat,
      // estimMonthlyQuantitySold: keepaDataItem.estimMonthlyQuantitySold,
      // estimNumberOfSeller: keepaDataItem.estimNumberOfSeller,
      // desiredNumberOfWeeksCovered: keepaDataItem.desiredNumberOfWeeksCovered,
    };
  });
  return asinSourcingCatalogData;
}

module.exports = processDataIntoAsinSourcingCatalog;
