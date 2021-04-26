import Sequelize from 'sequelize';

export default class Task extends Sequelize.Model {};
Task.init( {
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
  creatorId: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
  },
  responsibleId: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
  },
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
},
{
  sequelize,
  modelName: 'task',
});