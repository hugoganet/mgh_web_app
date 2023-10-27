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
		productCategoryNameEN: {
			type: DataTypes.STRING(150),
			allowNull: false
		},
		productCategoryNameFR: {
			type: DataTypes.STRING(150),
			allowNull: false
		},
		productCategoryNameDE: {
			type: DataTypes.STRING(150),
			allowNull: false
		},
		productCategoryNameES: {
			type: DataTypes.STRING(150),
			allowNull: false
		},
		productCategoryNameIT: {
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
