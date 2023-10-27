// ProductTaxCategory.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	class ProductTaxCategory extends Model {

	}

	ProductTaxCategory.init({
		productTaxCategoryId: {
			type: DataTypes.INTEGER,
			primaryKey: true, // part of composite key
			allowNull: false
		},
		countryCode: {
			type: DataTypes.CHAR(2),
			primaryKey: true, // part of composite key
			allowNull: false,
			references: {
				model: 'Country',
				key: 'countryCode'
		}
		},
		productTaxCategoryName: {
			type: DataTypes.STRING(100),
			allowNull: false
		},
		productTaxCategoryDescription: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		vatRateCategory: {
			type: DataTypes.CHAR(2),
			allowNull: false,
			references: {
				model: 'VatRatePerCountry', 
				key: 'vat_rate'
			}
		}
	}, {
		sequelize,
			modelName: 'ProductTaxCategory',
			tableName: 'product_tax_categories' 
	});

	return ProductTaxCategory;
};
