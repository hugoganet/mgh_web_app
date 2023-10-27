const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	class Ean extends Model {

	}
	
	Ean.init({
		ean: {
			type: DataTypes.STRING(13),
			primaryKey: true
		},
		productName: { // this creates a column called product_name in the table
			type: DataTypes.STRING(100),
			allowNull: false
		},
		brandId: { // this create a column called brand_id in the table
			type: DataTypes.INTEGER,
			references: {
				model: 'brands_table', // so here I should specify the table's name in my db, so brands_table ?
				key: 'brand_id'  // this should be brand_id in the table, right ?
			}
		}
	}, {
		sequelize,
			modelName: 'Ean',
			tableName: 'eans'
	});

	return Ean;
};
