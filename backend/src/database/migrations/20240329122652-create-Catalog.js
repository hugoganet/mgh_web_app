/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('catalog', {
      catalogId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      ean: {
        type: Sequelize.STRING(13),
        allowNull: false,
        validate: {
          is: {
            args: /^[0-9]{13}$/,
            msg: 'EAN must be 13 digits long.',
          },
        },
      },
      supplierId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'suppliers',
          key: 'supplier_id',
        },
      },
      supplierPartNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      brandId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'brands',
          key: 'brand_id',
        },
      },
      unitPackSize: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      productPriceExc: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      productVatRate: {
        type: Sequelize.DECIMAL(6, 5),
        allowNull: false,
      },
      catalogEntryLastUpdate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('catalog');
  },
};
