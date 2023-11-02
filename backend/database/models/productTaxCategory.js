// ProductTaxCategory.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	class ProductTaxCategory extends Model {

	}

	ProductTaxCategory.init({
		productTaxCategoryId: {
			type: DataTypes.INTEGER,
			unique: true,
			allowNull: false
		},
		countryCode: {
			type: DataTypes.CHAR(2),
			allowNull: false,
			primaryKey: true, // part of composite key
			references: {
				model: 'countries',
				key: 'country_code'
		}
		},
		productTaxCategoryName: {
			type: DataTypes.STRING(100),
			primaryKey: true, // part of composite key
			allowNull: false
		},
		productTaxCategoryDescription: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		
		vatCategoryId: {
			type: DataTypes.CHAR(2),
			allowNull: false,
			references: {
				model: 'vat_categories',
				key: 'vat_category_id'
			}
		}
		
	}, {
		sequelize,
			modelName: 'ProductTaxCategory',
			tableName: 'product_tax_categories' 
	});

	return ProductTaxCategory;
};
