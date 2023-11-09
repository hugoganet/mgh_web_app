const { Model, DataTypes } = require('sequelize');

module.exports = sequelize => {
  /**
   * @class MinimumSellingPrice
   * @extends Model
   * @classdesc Represents the minimum and maximum selling prices for SKUs, based on various factors including pricing rules and referral fees.
   */
  class MinimumSellingPrice extends Model {}

  MinimumSellingPrice.init(
    {
      minimumSellingPriceId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      skuId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'skus',
          key: 'sku_id',
        },
      },
      pricingRuleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'pricing_rules',
          key: 'pricing_rule_id',
        },
      },
      enrolledInPanEu: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      eligibleForPanEu: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      referralFeeCategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'amazon_referral_fees',
          key: 'referral_fee_category_id',
        },
      },
      minimumMarginWanted: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      minimumSellingPriceLocalAndPanEu: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      minimumSellingPriceEfn: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      maximumSellingPriceLocalAndPanEu: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      maximumSellingPriceEfn: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'MinimumSellingPrice',
      tableName: 'minimum_selling_prices',
      timestamps: false,
    },
  );

  return MinimumSellingPrice;
};
