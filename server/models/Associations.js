import Task from './Task.js';
import User from './User.js';

User.hasMany(Task, {foreignKey: 'creatorId', onUpdate: 'CASCADE'});
User.hasMany(Task, {foreignKey: 'responsibleId', onUpdate: 'CASCADE'});
User.belongsTo(User, {foreignKey: 'leaderId'});

Task.belongsTo(User, {foreignKey: 'creatorId'});
Task.belongsTo(User, {foreignKey: 'responsibleId'});

export default {User, Task};