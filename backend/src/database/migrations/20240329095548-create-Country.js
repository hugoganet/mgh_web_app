/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('countries', {
      countryCode: {
        type: Sequelize.CHAR(2),
        primaryKey: true,
        allowNull: false,
      },
      countryName: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      countryMarketplaceDomain: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('countries');
  },
};
