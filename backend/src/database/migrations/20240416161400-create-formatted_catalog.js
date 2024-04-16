/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('formatted_catalog', {
      formattedCatalogId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      ean: {
        type: Sequelize.STRING(13),
        allowNull: false,
        unique: true,
        validate: {
          is: {
            args: /^[0-9]{13}$/,
            msg: 'EAN must be 13 digits long.',
          },
        },
      },
      supplierPartNumber: {
        type: Sequelize.STRING(50),
      },
      productName: {
        type: Sequelize.STRING(250),
      },
      productPriceExc: {
        type: Sequelize.DECIMAL(10, 2),
      },
      productVatRate: {
        type: Sequelize.DECIMAL(6, 5),
      },
      currencyCode: {
        type: Sequelize.CHAR(3),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('formatted_catalog');
  },
};
