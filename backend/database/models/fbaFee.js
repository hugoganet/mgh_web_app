const { Model, DataTypes } = require('sequelize');

module.exports = sequelize => {
  /**
   * @class FbaFee
   * @extends Model
   * @classdesc Represents the FBA fees associated with an ASIN, including package dimensions and category-based fees.
   */
  class FbaFee extends Model {}

  FbaFee.init(
    {
      fbaFeeId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      asinId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'asins',
          key: 'asin_id',
        },
      },
      packageLength: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      packageWidth: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      packageHeight: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      packageWeight: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      priceGridFbaFeeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'price_grid_fba_fees',
          key: 'price_grid_fba_fee_id',
        },
      },
      fbaFeesLocalAndPanEu: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      fbaFeesEfn: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'FbaFee',
      tableName: 'fba_fees',
    },
  );

  return FbaFee;
};
