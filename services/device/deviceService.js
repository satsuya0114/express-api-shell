const _ = require('lodash');
const errorCode = require('../../errorCode/errorCode');
const deviceDao = require('./deviceDao');
const accountDao = require('../account/accountDao');
const logger = require('../../logger');
const has = require('has');

exports.checkCreateDevice = params => new Promise((resolve, reject) => {
  const {device_name, device_mac, device_ip, device_port, device_owner} = params;
  accountDao.checkAccount(device_owner)
    .then((searchAccount) => {
      if (_.isEmpty(searchAccount)) return Promise.reject({ errorCode: errorCode.INVALID_ACCOUNT_ID });
      return deviceDao.checkCreateDevice(device_name, device_mac, device_ip, device_port, device_owner);
    })
    .then((result) => {
      if (_.isEmpty(result)) resolve(params);
      else {
        // [{duplicate: "ERRORCODE"}, {duplicate: "ERRORCODE"}, {duplicate: "ERRORCODE"}] to "ERRORCODE1,ERRORCODE2"
        const errorString = _.uniq(result.map(o => o.duplicate)).join();
        // const arr = _.join(_.uniq(_.map(result, o => o.duplicate)));
        reject({errorCode: errorString});
      }
    }).catch(error => reject(error));
});

exports.createDevice = params => new Promise((resolve, reject) => {
  const {device_id} = params;
  deviceDao.createDevice(params)
    .then((result) => {
      if (result === 'NO ATTRIBUTE' || result.length > 0) resolve({device_id});
      else reject({});
    })
    .catch((error) => {
      logger.error('[deviceService][createDevice][ERROR]');
      logger.error(JSON.stringify(error));
      reject(error);
    });
});

exports.deviceInfo = device_id => new Promise((resolve, reject) => {
  deviceDao.getDeviceInfo(device_id)
    .then((dbResult) => {
      if (_.isEmpty(dbResult)) reject({ errorCode: errorCode.INVALID_DEVICE_ID });// return blank object if no data.
      else {
        const dbObj = dbResult.get({
          plain: true
        }); // dbResult.toJSON() /  turn form sequelize obj to normal obj
        const returnResult = Object.assign({}, dbObj); // clone from dbResult
        delete returnResult.deviceAttributes; // no need deviceAttributes
        // const { deviceAttributes, ...returnResult } = dbObj; // clone from dbResult but not need deviceAttributes spread syntax for obj when node version > 8.3
        const device_attribute = [];
        dbObj.deviceAttributes.forEach((attribute) => { // add customos device_attribute
          const attrvalueObj = attribute.deviceAttributeValue;
          device_attribute[attribute.attribute_name] = (attrvalueObj) ? attrvalueObj.attrvalue_value : '';
          const attributePair = {
            name: attribute.attribute_name,
            value: (attrvalueObj) ? attrvalueObj.attrvalue_value : null
          };
          device_attribute.push(attributePair);
        });
        returnResult.device_attribute = device_attribute;
        resolve(returnResult);
      }
    })
    .catch((error) => {
      logger.error('[deviceService][deviceInfo][ERROR]');
      console.log(error);
      reject(error);
    });
});

exports.deviceInfoDataHandle = dbResult => new Promise((resolve, reject) => {
  if (_.isEmpty(dbResult)) reject({ errorCode: errorCode.INVALID_DEVICE_ID });// return blank object if no data.
  else {
    const dbObj = dbResult; // dbResult.toJSON() /  turn form sequelize obj to normal obj
    const returnResult = Object.assign({}, dbObj); // clone from dbResult
    delete returnResult.deviceAttributes; // no need deviceAttributes
    // const { deviceAttributes, ...returnResult } = dbObj; // clone from dbResult but not need deviceAttributes spread syntax for obj when node version > 8.3
    const device_attribute = [];
    dbObj.deviceAttributes.forEach((attribute) => { // add customos device_attribute
      const attrvalueObj = attribute.deviceAttributeValue;
      device_attribute[attribute.attribute_name] = (attrvalueObj) ? attrvalueObj.attrvalue_value : '';
      const attributePair = {
        name: attribute.attribute_name,
        value: (attrvalueObj) ? attrvalueObj.attrvalue_value : null
      };
      device_attribute.push(attributePair);
    });
    returnResult.device_attribute = device_attribute;
    resolve(returnResult);
  }
});

/**
 * to check if device_id exist and get device_owner used in checkUpdateDevice
 */
exports.getDeviceOwner = device_id => new Promise((resolve, reject) => {
  deviceDao.getDeviceOwner(device_id)
    .then((dbResult) => {
      if (_.isEmpty(dbResult)) reject({ errorCode: errorCode.INVALID_DEVICE_ID });
      else {
        const result = dbResult.get({plain: true});
        (result.device_owner) ? resolve(result.device_owner) : reject({});
      }
    })
    .catch(error => reject(error));
});
/**
 * check if mac ip+port is duplicate with other devices except self
 * @return Promise<params,error>
 */
exports.checkUpdateDevice = (params, device_owner) => new Promise((resolve, reject) => {
  const { device_id, device_name, device_mac, device_ip, device_port} = params;
  deviceDao.checkUpdateDevice(device_id, device_name, device_mac, device_ip, device_port, device_owner)
    .then((result) => {
      if (_.isEmpty(result)) {
        const returnParams = Object.assign({}, params);
        returnParams.device_owner = device_owner; // device owner will be use in updateStream
        resolve(returnParams);
      } else {
        // [{duplicate: "ERRORCODE"}, {duplicate: "ERRORCODE"}, {duplicate: "ERRORCODE"}] to "ERRORCODE1,ERRORCODE2"
        const errorString = _.uniq(result.map(o => o.duplicate)).join();
        // const arr = _.join(_.uniq(_.map(result, o => o.duplicate)));
        reject({ errorCode: errorString });
      }
    }).catch(error => reject(error));
});

/**
 * check if update device attribute item and attribute name is as same as before
 * resolve(params)
 */
exports.checkAttribute = params => new Promise((resolve, reject) => {
  const {device_id, device_attribute} = params;
  deviceDao.getAttributeName(device_id)
    .then((result) => {
      const dbAttr = [];
      result.forEach((obj) => {
        dbAttr.push(obj.attribute_name);
      });
      const putAttr = [];
      device_attribute.forEach((obj) => {
        putAttr.push(obj.name);
      });
      if (putAttr.length !== dbAttr.length) reject({errorCode: errorCode.PARAMETER_LOSE_OR_ERROR});
      const diff = _.intersectionWith(dbAttr, putAttr, _.isEqual); // just list same part
      if (diff.length !== dbAttr.length) reject({errorCode: errorCode.PARAMETER_LOSE_OR_ERROR});
      else resolve(params);
    })
    .catch(error => reject(error));
});

/**
 * DB update device
 */
exports.updateDevice = params => new Promise((resolve, reject) => {
  const {device_id} = params;
  deviceDao.updateDevice(params)
    .then((result) => {
      if (result === 'NO ATTRIBUTE' || result.length > 0) resolve({ device_id });
      else reject({});
    })
    .catch((error) => {
      logger.error('[deviceService][updateDevice][ERROR]');
      console.log(error);
      reject(error);
    });
});

/**
 * get device_id, device_streaming_url to delete stream before delete device
 */
exports.getDeviceSetting = device_id => new Promise((resolve, reject) => {
  deviceDao.getDeviceSetting(device_id)
    .then((dbResult) => {
      if (dbResult && dbResult.device_id) {
        const result = dbResult.get({plain: true});
        resolve(result); // turn to palin object from sequelize find
      } else reject({ errorCode: errorCode.INVALID_DEVICE_ID });
    })
    .catch((error) => {
      logger.error('[deviceService][deleteDeviceCheck][ERROR]');
      console.log(error);
      reject(error);
    });
});

/**
 * delete DB device include its attribute
 */
exports.deleteDevice = device_id => new Promise((resolve, reject) => {
  deviceDao.deleteDevice(device_id)
    .then((dbResult) => {
      if (dbResult === 1) resolve({ device_id });
      else reject({ errorCode: errorCode.INVALID_DEVICE_ID });
    })
    .catch((error) => {
      logger.error('[deviceService][deleteDevice][ERROR]');
      console.log(error);
      reject(error);
    });
});

/**
 * check device and get device_owner
 */
exports.checkDeviceGetOwner = device_id => new Promise((resolve, reject) => {
  deviceDao.checkDeviceGetOwner(device_id)
    .then((result) => {
      if (_.isEmpty(result)) reject({ errorCode: errorCode.INVALID_DEVICE_ID});
      else {
        const {device_owner} = result.get({plain: true});
        resolve(device_owner);
      }
    })
    .catch(error => reject(error));
});
