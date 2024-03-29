/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pricing_rules', {
      pricing_rule_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      pricing_rule_name: {
        type: Sequelize.STRING(250),
        allowNull: false,
      },
      pricing_rule_description: Sequelize.TEXT,
      pricing_rule_minimum_roi_percentage: Sequelize.DECIMAL(7, 5),
      pricing_rule_minimum_margin_amount: Sequelize.DECIMAL(10, 2),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('pricing_rules');
  },
};
