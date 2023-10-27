const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  	class Brand extends Model {

    }

    Brand.init({
        brandId: { // this should be brand_id in the table, right ?
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        brandName: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
        }, {
        sequelize,
        modelName: 'Brand',
		tableName: 'brands_table' // addind '_table' for the test
    });

    return Brand;
}
