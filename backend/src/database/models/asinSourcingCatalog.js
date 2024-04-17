const { Model, DataTypes } = require('sequelize');

module.exports = sequelize => {
  /**
   * @class
   * @extends Model
   * @classdesc Model representing ASIN sourcing catalog details, including financial metrics, pricing, and stock estimates.
   */
  class AsinSourcingCatalog extends Model {}

  AsinSourcingCatalog.init(
    {
      asinSourcingCatalogId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      asin: {
        type: DataTypes.STRING(20),
        allowNull: false,
        references: {
          model: 'keepa_data',
          key: 'asin',
        },
      },
      ean: {
        type: DataTypes.CHAR(13),
        allowNull: false,
        references: {
          model: 'formatted_catalog',
          key: 'ean',
        },
      },
      productCategoryRank: {
        type: DataTypes.DECIMAL(6, 5),
      },
      averageSellingPriceInc: {
        type: DataTypes.DECIMAL(10, 2),
      },
      estimAsinAcquisitionCostExc: {
        type: DataTypes.DECIMAL(10, 2),
      },
      estimAsinAcquisitionCostInc: {
        type: DataTypes.DECIMAL(10, 2),
      },
      minimumSellingPriceLocalAndPanEu: {
        type: DataTypes.DECIMAL(10, 2),
      },
      minimumSellingPriceEfn: {
        type: DataTypes.DECIMAL(10, 2),
      },
      estimMonthlyRevenu: {
        type: DataTypes.DECIMAL(10, 2),
      },
      estimMonthlyMarginExc: {
        type: DataTypes.DECIMAL(10, 2),
      },
      estimAcquisitionCostExc: {
        type: DataTypes.DECIMAL(10, 2),
      },
      estimPersonalMonthlyQuantitySold: {
        type: DataTypes.INTEGER,
      },
      pvMoyenConstate: {
        type: DataTypes.DECIMAL(10, 2),
      },
      fbaFees: {
        type: DataTypes.DECIMAL(10, 2),
      },
      prepFees: {
        type: DataTypes.DECIMAL(10, 2),
      },
      transportFees: {
        type: DataTypes.DECIMAL(10, 2),
      },
      isHazmat: {
        type: DataTypes.BOOLEAN,
      },
      estimMonthlyQuantitySold: {
        type: DataTypes.INTEGER,
      },
      estimNumberOfSeller: {
        type: DataTypes.INTEGER,
      },
      desiredNumberOfWeeksCovered: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: 'AsinSourcingCatalog',
      tableName: 'asin_sourcing_catalog',
      timestamps: false,
    },
  );

  return AsinSourcingCatalog;
};