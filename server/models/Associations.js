import Task from './Task.js';
import User from './User.js';

User.hasMany(Task, {foreignKey: 'creatorId', sourceKey: 'id', onUpdate: 'CASCADE'});
User.hasMany(Task, {foreignKey: 'responsibleId', sourceKey: 'id', onUpdate: 'CASCADE'});
User.belongsTo(User, {foreignKey: 'leaderId', targetKey: 'id',});

Task.belongsTo(User, {as: 'creator', foreignKey: 'creatorId', targetKey: 'id', });
Task.belongsTo(User, {as: 'responsible', foreignKey: 'responsibleId', targetKey: 'id', });

User.prototype.getSubordinatesTasks = async function(filters = {}) {
  return Task.getAllByUserIds(
    (await this.getSubordinates()).map(item => item.id),
    filters
  );
}
User.prototype.getFullTasks = function () {
  return this.getTasks({
    include: [
      {
        association: 'creator',
        attributes: ['id', 'name', 'surname', 'secondName']
      },
      {
        association: 'responsible',
        attributes: ['id', 'name', 'surname', 'secondName']
      },
    ]
  });
}

Task.findAll({
  include: [
    {
      association: 'creator',
      attributes: ['id', 'name', 'surname', 'secondName']
    },
    {
      association: 'responsible',
      attributes: ['id', 'name', 'surname', 'secondName']
    },
  ]
});
Task.findOne({
  include: [
    {
      association: 'creator',
      attributes: ['id', 'name', 'surname', 'secondName']
    },
    {
      association: 'responsible',
      attributes: ['id', 'name', 'surname', 'secondName']
    },
  ]
});

global.sequelize.sync();
export default {User, Task};