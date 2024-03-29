/* eslint-disable new-cap */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pricing_rules', {
      pricingRuleId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      pricingRuleName: {
        type: Sequelize.STRING(250),
        allowNull: false,
      },
      pricingRuleDescription: Sequelize.TEXT,
      pricingRuleMinimumRoiPercentage: Sequelize.DECIMAL(7, 5),
      pricingRuleMinimumMarginAmount: Sequelize.DECIMAL(10, 2),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('pricing_rules');
  },
};
