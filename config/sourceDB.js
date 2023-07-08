require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(`mssql://${process.env.SOURCE_DB_USERNAME}:${process.env.SOURCE_DB_PASSWORD}@${process.env.SOURCE_DB_HOST}:${process.env.SOURCE_DB_PORT}/${process.env.SOURCE_DB_DATABASE}?dialect=mssql&driver=tedious`,
{
  pool: {
    max: 15,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: {
    options: {
      encrypt: true
    }
  }
});

try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

module.exports = sequelize;