import Sequelize from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DB_name, process.env.DB_username, process.env.DB_password, {
  host: process.env.DB_host,
  dialect: 'mysql',
  define: {
    charset: 'utf8',
    collate: 'utf8_general_ci'
  }
});

export default sequelize;
global.sequelize = sequelize;