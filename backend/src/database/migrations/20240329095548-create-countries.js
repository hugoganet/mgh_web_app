/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('countries', {
      country_code: {
        type: Sequelize.CHAR(2),
        primaryKey: true,
        allowNull: false,
      },
      country_name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      country_marketplace_domain: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('countries');
  },
};
