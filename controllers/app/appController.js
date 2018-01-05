const util = require('util');
const appService = require('../../services/app/appService');
const commonService = require('../../services/common/commonService');
const ResFormator = require('../../utils/formator');
const validate = require('./validate');
const logger = require('../../logger');
const errorCode = require('../../errorCode/errorCode');

exports.addApplication = (req, res, next) => {
  const app_name = req.body.app_name;

  // Generate UUID for app_id
  const app_id = commonService.generateUUIDByTimestamp();

  // Generate key for app_key
  const app_key = util.format('%s-%s', app_name, commonService.generateUUIDByRandom());
  const resFormator = new ResFormator();
  const validateResult = validate.addApplication({ app_name });
  if (validateResult.error) {
    logger.error(`[appController][addApplication][PARAMETER_ERROR]: ${validateResult.error.message}`);
    resFormator.errorCode = errorCode.ARGUMENTS_ERROR(validateResult.errorKeys);
    req.ctrlResult = resFormator;
    next();
  } else {
    // Call Service
    appService.addApplication(app_name, app_id, app_key)
      .then((result) => {
        logger.info(`[appController][addApplication]: ${JSON.stringify(result)}`);
        req.ctrlResult = new ResFormator(result);
        next();
      })
      .catch((error) => {
        logger.error(`[appController][addApplication][Error]: ${JSON.stringify(error)}`);
        req.ctrlResult = new ResFormator();
        if (error.errorCode) req.ctrlResult.errorCode = error.errorCode;
        next();
      });
  }
};

exports.updateApplicationInfo = (req, res, next) => {
  const app_id = req.params.app_id;
  const app_name = req.body.app_name;
  const resFormator = new ResFormator();
  const validateResult = validate.updateApplicationInfo({ app_id, app_name });
  if (validateResult.error) {
    logger.error(`[appController][updateApplicationInfo][PARAMETER_ERROR]: ${validateResult.error.message}`);
    resFormator.success = false;
    resFormator.errorCode = errorCode.ARGUMENTS_ERROR(validateResult.errorKeys);
    req.ctrlResult = resFormator;
    next();
  } else {
    appService.updateApplicationInfo(app_id, app_name).then((result) => {
      logger.info(`[appController][updateApplicationInfo] Successful info = ${JSON.stringify(result)}`);
      req.ctrlResult = new ResFormator(result);
      next();
    }).catch((error) => {
      logger.error(`[appController][updateApplicationInfo][Error] Failed info = ${JSON.stringify(error)}`);
      req.ctrlResult = new ResFormator();
      if (error.errorCode) req.ctrlResult.errorCode = error.errorCode;
      next();
    });
  }
};
