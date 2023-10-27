const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	class Asin extends Model {

	}
	
	Asin.init({
		asin: {
			type: DataTypes.STRING(10),
			primaryKey: true,
			allowNull: false
		},
		countryCode: {
			type: DataTypes.CHAR(2),
			primaryKey: true,
			allowNull: false,
			references: {
				model: 'countries',
				key: 'countryCode'
			}
		},
		productCategoryId: {
			type: DataTypes.INTEGER,
			references: {
				model: 'ProductCategories',
				key: 'productCategoryId'
			}
		},
		product_category_rank_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'ProductCategoryRanks',
				key: 'product_category_rank_id'
			}
		},
		product_tax_category_id: {
			type: DataTypes.STRING(15),
			allowNull: false,
			references: {
				model: 'ProductTaxCategories',
			}
		},
		asin_preparation: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		url_amazon: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		url_image: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		asin_name: {
			type: DataTypes.STRING(100),
			allowNull: false
		},
		asin_potential_warehouse_quantity: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
		// This field requires custom logic or a database trigger
		},
		asin_number_of_active_sku: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
		// This field requires custom logic or a database trigger
		},
		asin_average_unit_sold_per_day: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: false,
			defaultValue: 0.00
		// This field requires custom logic or a database trigger
		},
		batterie_required: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		is_hazmat: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
		}, {
		sequelize,
			modelName: 'Asin',
			tableName: 'asins'  
	});

	return Asin;
};
