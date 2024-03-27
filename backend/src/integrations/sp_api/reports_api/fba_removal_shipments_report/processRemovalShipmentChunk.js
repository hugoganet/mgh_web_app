/* eslint-disable require-jsdoc */
const { logger } = require('../../../../utils/logger');
const {
  parseAndValidateNumber,
} = require('../../../../utils/parseAndValidateNumber');
const db = require('../../../../api/models/index');

async function processRemovalShipmentChunk(
  chunk,
  dataStartTime,
  dataEndTime,
  createLog = false,
  logContext = 'processRemovalShipmentChunk',
) {
  let logMessage = ``;
  try {
    const sku = chunk['sku'];
    const requestDate = chunk['request-date'];
    const orderId = chunk['order-id'];
    const shipmentDate = chunk['shipment-date'];
    const fnsku = chunk['fnsku'];
    const disposition = chunk['disposition'];
    const shippedQuantity = parseAndValidateNumber(chunk['shipped-quantity']);
    const carrier = chunk['carrier'];
    const trackingNumber = chunk['tracking-number'];
    const orderType = chunk['order-type'];
    const warehouseId = 2; // DOCK AVENUE

    // get the skuId from the sku table
    const skuRecord = await db.Sku.findOne({ where: { sku } });
    if (!skuRecord) {
      throw new Error(
        `Error in processRemovalShipmentChunk: SKU record not found for: ${sku}.\n`,
      );
    }
    const skuId = skuRecord.skuId;

    // create a new record in the afn_removal_shipments_details table
    await db.AfnRemovalShipment.create({
      dataStartTime,
      dataEndTime,
      requestDate,
      orderId,
      shipmentDate,
      skuId,
      fnsku,
      disposition,
      shippedQuantity,
      carrier,
      trackingNumber,
      orderType,
      warehouseId,
    });
  } catch (error) {
    logMessage += `Error in processRemovalShipmentChunk: ${error}\n`;
    throw new Error(`Error in processRemovalShipmentChunk: ${error}\n`);
  } finally {
    if (createLog) {
      logger(logMessage, logContext);
    }
  }
}

module.exports = {
  processRemovalShipmentChunk,
};
