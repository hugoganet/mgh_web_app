/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('suppliers', {
      supplier_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      product_category_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'product_categories',
          key: 'product_category_id',
        },
      },
      supplier_name: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      supplier_website: {
        type: Sequelize.STRING(250),
        unique: true,
      },
      supplier_number: {
        type: Sequelize.STRING(20),
        unique: true,
      },
      supplier_email: {
        type: Sequelize.STRING(250),
        unique: true,
      },
      supplier_address: {
        type: Sequelize.STRING(255),
      },
      supplier_postcode: {
        type: Sequelize.STRING(20),
      },
      country_code: {
        type: Sequelize.STRING(50),
        references: {
          model: 'countries',
          key: 'country_code',
        },
      },
      supplier_note: {
        type: Sequelize.TEXT,
      },
      contact_name: {
        type: Sequelize.STRING(50),
      },
      contact_position: {
        type: Sequelize.STRING(50),
      },
      contact_number: {
        type: Sequelize.STRING(20),
      },
      contact_email: {
        type: Sequelize.STRING(250),
      },
      account_open: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      account_refused: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      account_refused_date: {
        type: Sequelize.DATE,
      },
      account_refused_reason: {
        type: Sequelize.TEXT,
      },
      is_interesting: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      is_brand: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('suppliers');
  },
};
