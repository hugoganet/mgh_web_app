const { Model, DataTypes } = require('sequelize');

module.exports = sequelize => {
  /**
   * @class ProductAndAmzReferralFeeCategory
   * @extends Model
   * @classdesc Represents the association between product categories and Amazon referral fee categories.
   */
  class ProductAndAmzReferralFeeCategory extends Model {}

  ProductAndAmzReferralFeeCategory.init(
    {
      productAndAmzReferralFeeCategoryId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      productCategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'product_categories',
          key: 'product_category_id',
        },
      },
      referralFeeCategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'amazon_referral_fees',
          key: 'referral_fee_category_id',
        },
      },
    },
    {
      sequelize,
      modelName: 'ProductAndAmzReferralFeeCategory',
      tableName: 'product_and_amz_referral_fees_categories',
      timestamps: false,
    },
  );

  return ProductAndAmzReferralFeeCategory;
};
