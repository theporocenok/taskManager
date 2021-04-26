// import Sequelize from "sequelize";
const Sequelize = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: Sequelize.STRING,
      surname: Sequelize.STRING,
      secondName: Sequelize.STRING,
      login: {
        type: Sequelize.STRING(40),
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      leaderId: Sequelize.INTEGER(11),
      salt: Sequelize.TEXT,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};
