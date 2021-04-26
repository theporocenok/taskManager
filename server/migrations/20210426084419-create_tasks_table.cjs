// import Sequelize from "sequelize";
const Sequelize = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('tasks', {
      id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      title: Sequelize.STRING,
      description: Sequelize.TEXT,
      expirationDate: Sequelize.DATE,
      priority: Sequelize.STRING,
      status: Sequelize.STRING,
      creatorId: Sequelize.INTEGER(11),
      responsibleId: Sequelize.INTEGER(11),
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('tasks');
  }
};
