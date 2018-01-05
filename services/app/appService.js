const logger = require('../../logger');
const errorCode = require('../../errorCode/errorCode');
const moment = require('moment');
const appDao = require('./appDao');

exports.verifyApplication = (app_id, app_key) => new Promise((resolve, reject) => {
  logger.info(`[appService][verifyApplication] app_id = ${app_id}, app_key = ${app_key}`);
  appDao.verifyCheck(app_id, app_key)
    .then((count) => {
      const result = { isExisted: true };
      if (count === 0) {
        result.isExisted = false;
        result.errorCode = errorCode.AUTHENTICATION_ERROR;
      }
      resolve(result);
    }).catch((err) => {
      logger.error(`[appService][verifyApplication][Error] Failed to query in DB = ${JSON.stringify(err)}`);
      reject(err);
    });
});

exports.addApplication = (app_name, app_id, app_key) => new Promise((resolve, reject) => {
  logger.info(`[appService][addApplication] appID = ${app_id}, appName = ${app_name}, appKey = ${app_key}`);
  const addAppInfo = {
    app_id,
    app_key,
    app_name
  };
  appDao.appCreate(addAppInfo)
    .then((dbResult) => {
      if (dbResult) {
        logger.info(`[appService][addApplication] Create new application = ${JSON.stringify(dbResult)}`);
        addAppInfo.app_create_time = moment(dbResult.app_create_time).unix(Number);
        resolve(addAppInfo);
      } else {
        logger.error('[appService][addApplication][Error] Failed to create in DB ');
        reject({});
      }
    }).catch((error) => {
      logger.error(`[appService][addApplication][Error] Failed to create in DB = ${JSON.stringify(error)}`);
      if (error.name === 'SequelizeUniqueConstraintError') {
        reject({errorCode: errorCode.VALUE_ERROR_SAME_VALUE});
      } else {
        reject(error);
      }
    });
});

exports.updateApplicationInfo = (app_id, app_name) => new Promise((resolve, reject) => {
  const app_updated_time = new Date();
  const updateInfo = { app_name, app_updated_time };
  logger.info(`[appService][updateApplicationInfo] appID = ${app_id}, updateInfo = ${JSON.stringify(updateInfo)}`);
  appDao.appUpdate(updateInfo, app_id)
    .then((dbResult) => {
      logger.info(`[appService][updateApplicationInfo] dbResult = ${JSON.stringify(dbResult)}`);
      // dbResult: Array<affectedCount, affectedRows>
      if (dbResult && dbResult instanceof Array && dbResult.length > 0 && dbResult[0] !== 0) {
        updateInfo.app_id = app_id;
        updateInfo.app_updated_time = moment(app_updated_time).unix(Number);
        resolve(updateInfo);
      } else {
        reject({errorCode: errorCode.INVALID_APP_ID});
      }
    }).catch((error) => {
      logger.error(`[appService][updateApplicationInfo][Error] Failed to update in DB = ${JSON.stringify(error)}`);
      if (error.name === 'SequelizeUniqueConstraintError') {
        reject({errorCode: errorCode.VALUE_ERROR_SAME_VALUE});
      } else {
        reject(error);
      }
    });
});
