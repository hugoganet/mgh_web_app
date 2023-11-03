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
			allowNull: false,
			unique: true
		},
		productCategoryNameFr: {
			type: DataTypes.STRING(150),
			allowNull: false,
			unique: true
		},
		productCategoryNameDe: {
			type: DataTypes.STRING(150),
			allowNull: false,
			unique: true
		},
		productCategoryNameEs: {
			type: DataTypes.STRING(150),
			allowNull: false,
			unique: true
		},
		productCategoryNameIt: {
			type: DataTypes.STRING(150),
			allowNull: false,
			unique: true
		}
	}, {
		sequelize,
			modelName: 'ProductCategory',
			tableName: 'product_categories'
	});

	return ProductCategory;
};
