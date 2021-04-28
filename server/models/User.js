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
  fio: {
    type: Sequelize.VIRTUAL(Sequelize.TEXT, ['name', 'surname', 'secondName']),
    get() {
      let surname = typeof this.getDataValue('surname') != 'undefined' ? this.getDataValue('surname') : '';
      let name = typeof this.getDataValue('name') != 'undefined' ? this.getDataValue('name')[0] + '.' : '';
      let secondName = typeof this.getDataValue('secondName') != 'undefined' ? this.getDataValue('secondName')[0] + '.' : '';
      if (surname || name || secondName) {
        return surname + ' ' + name + secondName;
      }
      return null;
    }
  },
  full_name: {
    type: Sequelize.VIRTUAL(Sequelize.TEXT, ['name', 'surname', 'secondName']),
    get() {
      let surname = typeof this.getDataValue('surname') != 'undefined' ? this.getDataValue('surname') : '';
      let name = typeof this.getDataValue('name') != 'undefined' ? this.getDataValue('name') : '';
      let secondName = typeof this.getDataValue('secondName') != 'undefined' ? this.getDataValue('secondName') : '';
      if (surname || name || secondName) {
        return surname + ' ' + name + ' ' + secondName;
      }
      return null;
    }
  },
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