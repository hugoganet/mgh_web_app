const { Model, DataTypes } = require('sequelize');

module.exports = sequelize => {
  /**
   * @class PricingRule
   * @extends Model
   * @classdesc The pricing rules set for calculating the minimum price based on ROI and margin.
   */
  class PricingRule extends Model {}

  PricingRule.init(
    {
      pricingRuleId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      pricingRuleName: {
        type: DataTypes.STRING(250),
        allowNull: false,
      },
      pricingRuleDescription: {
        type: DataTypes.TEXT,
      },
      pricingRuleMinimumRoi: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      pricingRuleMinimumMargin: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'PricingRule',
      tableName: 'pricing_rules',
      timestamps: false,
    },
  );

  return PricingRule;
};
