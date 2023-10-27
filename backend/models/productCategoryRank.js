// ProductCategoryRank.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class ProductCategoryRank extends Model {

    }

    ProductCategoryRank.init({
        productCategoryRankId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        countryCode: {
            type: DataTypes.CHAR(2),
            allowNull: false,
            references: {
              model: 'Country', 
              key: 'countryCode'
            }
        },
        productCategoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: 'ProductCategory', 
              key: 'productCategoryId'
            }
        },
        rankingThreshold: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        rankingThresholdPercentage: {
            type: DataTypes.DECIMAL(10, 5),
            allowNull: false
        }
    }, {
      sequelize,
        modelName: 'ProductCategoryRank',
        tableName: 'product_categories_ranks'
    });

    return ProductCategoryRank;
};
