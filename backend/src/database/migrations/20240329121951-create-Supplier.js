/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('suppliers', {
      supplierId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      productCategoryId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'product_categories',
          key: 'product_category_id',
        },
      },
      supplierName: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      supplierWebsite: {
        type: Sequelize.STRING(250),
        unique: true,
      },
      supplierNumber: {
        type: Sequelize.STRING(20),
        unique: true,
      },
      supplierEmail: {
        type: Sequelize.STRING(250),
        unique: true,
      },
      supplierAddress: {
        type: Sequelize.STRING(255),
      },
      supplierPostcode: {
        type: Sequelize.STRING(20),
      },
      countryCode: {
        type: Sequelize.STRING(50),
        references: {
          model: 'countries',
          key: 'country_code',
        },
      },
      supplierNote: {
        type: Sequelize.TEXT,
      },
      contactName: {
        type: Sequelize.STRING(50),
      },
      contactPosition: {
        type: Sequelize.STRING(50),
      },
      contactNumber: {
        type: Sequelize.STRING(20),
      },
      contactEmail: {
        type: Sequelize.STRING(250),
      },
      accountOpen: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      accountRefused: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      accountRefusedDate: {
        type: Sequelize.DATE,
      },
      accountRefusedReason: {
        type: Sequelize.TEXT,
      },
      isInteresting: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      isBrand: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('suppliers');
  },
};
