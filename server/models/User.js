import Sequelize from 'sequelize';
import crypto from 'crypto';

export default class User extends Sequelize.Model {};

User.init({
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
    get() {
      return() => this.getDataValue('password')
    },
  },
  leaderId: {
    type: Sequelize.INTEGER(11),
  },
  salt: {
    type: Sequelize.TEXT,
    get() {
      return() => this.getDataValue('salt')
    },
  },
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
},
{
  sequelize,
  modelName: 'user',
});

const setSaltAndPassword = user => {
  if (user.changed('password')) {
    user.salt = generateSalt()
    user.password = encryptPassword(user.password(), user.salt())
  }
};

User.beforeCreate(setSaltAndPassword);
User.beforeUpdate(setSaltAndPassword);
User.findUser = function(findingUser) {
  return User.findOne({
    where: {
      login: findingUser.login,
    }
  })
}
User.prototype.getSubordinates = async function(attrs = ['id'], params = {},) {
  return await User.findAll({
    attributes: attrs,
    where: {
      [Sequelize.Op.or]: {
        leaderId: this.id,
        id: this.id,
      }
    },
  });
}
User.prototype.getAllTasks = async function() {
  return [].concat(
    (await this.getFullTasks()).map(task => task.dataValues),
    (await this.getSubordinatesTasks()).map(task => task.dataValues)
  );

}
User.prototype.correctPassword = function(enteredPassword) {
  return encryptPassword(enteredPassword, this.salt()) === this.password();
}

function generateSalt() {
  return crypto.randomBytes(16).toString('base64')
}
function encryptPassword(plainText, salt) {
  return crypto
    .createHash('RSA-SHA256')
    .update(plainText)
    .update(salt)
    .digest('hex')
}