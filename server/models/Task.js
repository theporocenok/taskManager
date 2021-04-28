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
        attributes: ['id', 'name', 'surname', 'secondName']
      },
      {
        association: 'responsible',
        attributes: ['id', 'name', 'surname', 'secondName']
      },
    ],
    where: {
      creatorId: ids,
      expirationDate: !!filters.dateFrom
        ? {[Sequelize.Op.gt]: new Date(filters.dateFrom)}
        : {[Sequelize.Op.ne]: 'undefined'},
      [Sequelize.Op.and]: {
        expirationDate: !!filters.dateTo
          ? {[Sequelize.Op.lt]: new Date(filters.dateTo)}
          : {[Sequelize.Op.ne]: 'undefined'},
      }
    },
    order: [['updatedAt', 'DESC']],
    group: !!filters.groupBy ? filters.groupBy : undefined,
  })
}