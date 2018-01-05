const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const logger = require('../logger');
const commoneService = require('../services/common/commonService');

const basename = path.basename(module.filename);

const db = {};

const configInfo = commoneService.getConfigInfo();
const dbConfig = configInfo.dbConfig;

logger.info('[models][index] new Sequelize');
const sequelize = new Sequelize(
  dbConfig.dbName, dbConfig.user, dbConfig.password, {
    host: dbConfig.host,
    dialect: 'mysql',
    pool: {
      max: 1,
      min: 0,
      idle: 10000
    },
    define: {
      timestamps: false
    },
  });

// read models, adding them to the db object and applying relationships
fs
  .readdirSync(__dirname)
  .filter(file =>
    (file.indexOf('.') !== 0) &&
    (file !== basename) &&
    (file.slice(-3) === '.js'))
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
