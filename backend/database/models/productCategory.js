// ProductCategory.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	class ProductCategory extends Model {

	}

	ProductCategory.init({
		productCategoryId: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		productCategoryNameEn: {
			type: DataTypes.STRING(150),
			allowNull: false
		},
		productCategoryNameFr: {
			type: DataTypes.STRING(150),
			allowNull: false
		},
		productCategoryNameDe: {
			type: DataTypes.STRING(150),
			allowNull: false
		},
		productCategoryNameEs: {
			type: DataTypes.STRING(150),
			allowNull: false
		},
		productCategoryNameIt: {
			type: DataTypes.STRING(150),
			allowNull: false
		}
	}, {
		sequelize,
			modelName: 'ProductCategory',
			tableName: 'product_categories'
	});

	return ProductCategory;
};
