const deviceService = require('../../services/device/deviceService');
const commonService = require('../../services/common/commonService');
const ResFormator = require('../../utils/formator');
const errorCode = require('../../errorCode/errorCode');
const logger = require('../../logger');
const validate = require('./validate');
const has = require('has');
const _ = require('lodash');

/**
 * first use ip and port to stream a wowza url and create a new device and its device attributes
 * request {device_name, device_ip, device_owner, device_attribute, scenemode_id, device_port,
 * device_zone, device_mac, device_did, device_password}
 * response {device_id}
 */
exports.createDevice = (req, res, next) => {
  const params = Object.assign({}, req.body);
  const validateResult = validate.createDevice(params);
  if (validateResult.error) {
    const resFormator = new ResFormator();
    resFormator.errorCode = errorCode.ARGUMENTS_ERROR(validateResult.errorKeys);
    req.ctrlResult = resFormator;
    next();
    return;
  }
  const device_id = commonService.generateUUIDByTimestamp();
  params.device_id = device_id; // add device_id to params
  deviceService.checkCreateDevice(params)
    .then(deviceService.createDevice)
    .then((result) => {
      logger.info('[deviceController][createDevice]:', result);
      req.ctrlResult = new ResFormator(result);
      next();
    })
    .catch((error) => {
      logger.error('[deviceController][createDevice][ERROR]:');
      logger.error(JSON.stringify(error));
      if (error.errorCode) req.ctrlResult.errorCode = error.errorCode;
      next();
    });
};
/**
 * get the info of device
 * request {device_id}
 * response {device_id, device_name, device_ip, device_attribute, scenemode_id, device_port,
 * device_zone, device_mac, device_did, device_password}
 */
exports.getDeviceInfo = (req, res, next) => {
  const { device_id } = req.params;
  deviceService.deviceInfo(device_id)
    .then((result) => {
      logger.info('[deviceController][getDeviceInfo]:', result);
      req.ctrlResult = new ResFormator(result);
      next();
    })
    .catch((error) => {
      logger.error(`[deviceController][getDeviceInfo][ERROR]: ${JSON.stringify(error)}`);
      req.ctrlResult = new ResFormator();
      if (error.errorCode) req.ctrlResult.errorCode = error.errorCode;
      next();
    });
};
/**
 * put device info and its attribute
 */
exports.updateDevice = (req, res, next) => {
  const params = req.body;
  const {device_id} = params;
  const validateResult = validate.updateDevice(params);
  if (validateResult.error) {
    const resFormator = new ResFormator();
    resFormator.errorCode = errorCode.ARGUMENTS_ERROR(validateResult.errorKeys);
    req.ctrlResult = resFormator;
    next();
    return;
  }
  deviceService.checkDeviceGetOwner(device_id)
    .then(device_owner => deviceService.checkUpdateDevice(params, device_owner))
    .then(deviceService.checkAttribute)
    .then(deviceService.updateDevice)
    .then((result) => {
      logger.info('[deviceController][updateDevice]:', result);
      req.ctrlResult = new ResFormator(result);
      next();
    })
    .catch((error) => {
      logger.error('[deviceController][updateDevice][Error]');
      logger.error(error);
      if (error.errorCode) req.ctrlResult.errorCode = error.errorCode;
      next();
    });
};
/**
 * delete the device and its device attribute
 * request {device_id}
 * response {device_id}
 */
exports.deleteDevice = (req, res, next) => {
  const { device_id } = req.params;
  deviceService.getDeviceSetting(device_id)
    .then(deviceService.deleteDevice)
    .then((result) => {
      logger.info('[deviceController][deleteDevice]:', result);
      req.ctrlResult = new ResFormator(result);
      next();
    })
    .catch((error) => {
      logger.error('[deviceController][deleteDevice][Error]');
      logger.error(error);
      console.log(error);
      if (error.errorCode) req.ctrlResult.errorCode = error.errorCode;
      next();
    });
};
