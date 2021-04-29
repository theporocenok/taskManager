import Sequelize from 'sequelize';
import moment from 'moment';

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

Task.getAllByUserIds = async function (ids = [], filters = {}) {
  return await Task.findAll({
    include: [
      {
        association: 'creator',
        attributes: ['id', 'fio', 'full_name']
      },
      {
        association: 'responsible',
        attributes: ['id', 'fio', 'full_name']
      },
    ],
    where: {
      responsibleId: !!filters.subordinate && filters.subordinate !== 'null'
        ? filters.subordinate
        : ids,
      expirationDate: !!filters.dateFrom && filters.dateFrom !== 'null'
        ? {[Sequelize.Op.gte]: new Date(filters.dateFrom)}
        : {[Sequelize.Op.ne]: 'undefined'},
      [Sequelize.Op.and]: {
        expirationDate: !!filters.dateTo && filters.dateTo !== 'null'
          ? {[Sequelize.Op.lt]: new Date(filters.dateTo)}
          : {[Sequelize.Op.ne]: 'undefined'},
      }
    },
    order: [['updatedAt', 'DESC']],
  })
}