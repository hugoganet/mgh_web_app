const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  	class Brand extends Model {

    }

    Brand.init({
        brandId: {
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
		tableName: 'brands' 
    });

    return Brand;
}
