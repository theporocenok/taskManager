import Task from './Task.js';
import User from './User.js';

User.hasMany(Task, {foreignKey: 'creatorId', sourceKey: 'id', onUpdate: 'CASCADE'});
User.hasMany(Task, {foreignKey: 'responsibleId', sourceKey: 'id', onUpdate: 'CASCADE'});
User.belongsTo(User, {foreignKey: 'leaderId', targetKey: 'id',});

Task.belongsTo(User, {foreignKey: 'creatorId', targetKey: 'id', });
Task.belongsTo(User, {foreignKey: 'responsibleId', targetKey: 'id', });

User.prototype.getSubordinatesTasks = async function(filters = {}) {
  return Task.getAllByUserIds(
    (await this.getSubordinates()).map(item => item.id),
    filters
  );
}

global.sequelize.sync();
export default {User, Task};