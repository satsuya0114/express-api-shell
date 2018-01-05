const sequelize = require('../../models').sequelize;
const Sequelize = require('sequelize');
const device = require('../../models').device;
const deviceAttribute = require('../../models').deviceAttribute;
const deviceAttributeValue = require('../../models').deviceAttributeValue;
const commonService = require('../common/commonService');
const errorCode = require('../../errorCode/errorCode');

const Op = Sequelize.Op;

exports.createDevice = (params) => {
  const { device_id, device_name, device_ip, device_owner, device_attribute, scenemode_id, device_port, device_zone,
    device_mac, device_did, device_password, device_streaming_url} = params;
  const transaction = sequelize.transaction((t) => {
    const sql = device.create({
      device_id,
      device_name,
      device_ip,
      device_owner,
      scenemode_id,
      device_port,
      device_zone,
      device_mac,
      device_did,
      device_password,
      device_url: `${device_ip}:${device_port}`,
      device_streaming_url
    }, {transaction: t}).then(() => {
      // device_attribute to deviceAttribute & deviceAttributeValue
      if (device_attribute.length) {
        const promises = [];
        for (let i = 0; i < device_attribute.length; i += 1) {
          const attribute_id = commonService.generateUUIDByTimestamp();
          const newPromise = deviceAttribute.create({
            attribute_id,
            device_id,
            attribute_name: device_attribute[i].name
          }, {transaction: t}).then(() => {
            const attrvalue_id = commonService.generateUUIDByTimestamp();
            return deviceAttributeValue.create({
              attrvalue_id,
              attribute_id,
              attrvalue_value: device_attribute[i].value
            }, {transaction: t});
          }); // end sql
          promises.push(newPromise);
        } // end for loop
        return Promise.all(promises);
      }
      return ('NO ATTRIBUTE');
    });
    return sql;
  });
  return transaction;
};

exports.getDeviceInfo = device_id => device.find({
  attributes: ['device_id', 'device_name', 'device_ip', 'scenemode_id',
    'device_port', 'device_zone', 'device_did', 'device_password',
  ],
  where: {
    device_id
  },
  include: [{
    model: deviceAttribute,
    attributes: ['attribute_name'],
    include: [{
      model: deviceAttributeValue,
      attributes: ['attrvalue_value'],
      required: false
    }],
    required: false
  }]
});

exports.getAttributeName = device_id => deviceAttribute.findAll({
  attributes: ['attribute_name'],
  where: {device_id},
  raw: true
});

exports.getDeviceOwner = device_id => device.find({
  attributes: ['device_id', 'device_owner'],
  where: {
    device_id
  }
});

exports.updateDevice = (params) => {
  const { device_id, device_name, device_ip, device_attribute, scenemode_id, device_port, device_zone,
    device_mac, device_did, device_password } = params;
  const deviceItem = {
    device_name,
    device_ip,
    scenemode_id,
    device_port,
    device_zone,
    device_mac,
    device_did,
    device_password,
    device_url: `${device_ip}:${device_port}`
  };
  const transaction = sequelize.transaction((t) => {
    const sql = device.update(deviceItem, {
      where: {device_id},
      transaction: t
    }).then(() => {
      // device_attribute to deviceAttribute & deviceAttributeValue
      if (device_attribute.length) {
        const promises = [];
        for (let i = 0; i < device_attribute.length; i += 1) {
          const newPromise = deviceAttribute.find({
            where: {
              device_id,
              attribute_name: device_attribute[i].name
            },
            include: [{
              model: deviceAttributeValue
            }],
            transaction: t
          })
            .then(instance => instance.deviceAttributeValue.updateAttributes({
              attrvalue_value: device_attribute[i].value
            }, { transaction: t }));
          promises.push(newPromise);
        } // end for loop
        return Promise.all(promises);
      }
      return ('NO ATTRIBUTE');
    });
    return sql;
  });
  return transaction;
};

exports.getDeviceSetting = device_id => device.find({
  attributes: ['device_id', 'device_ip', 'device_port', 'device_did', 'device_password',
    'device_streaming_url', 'scenemode_id', 'device_owner'],
  where: {device_id}
});

exports.deleteDevice = device_id => sequelize.transaction((t) => {
  // chain all your queries here. make sure you return them.
  const sql = device.destroy({
    where: {
      device_id
    },
    include: [{
      model: deviceAttribute,
      include: [{
        model: deviceAttributeValue,
        // truncate: true
      }],
      // truncate: true
    }],
    // truncate: true
    transaction: t
  });
  return sql;
});

exports.checkDeviceGetOwner = device_id => device.find({
  attributes: ['device_owner'],
  where: {
    device_id
  }
});

exports.checkCreateDevice = (device_name, device_mac, device_ip, device_port, device_owner) => device.findAll({
  // attributes: ['device_name', 'device_mac', 'device_ip', 'device_port'],
  attributes: [Sequelize.literal( // same device_ownder dont allow same device name
    `CASE WHEN (device_name = '${device_name}' AND device_owner = '${device_owner}') THEN "${errorCode.SAME_DEVICE_NAME}" 
          WHEN (device_mac = '${device_mac}') THEN "${errorCode.SAME_DEVICE_MAC}" 
          WHEN (device_ip = '${device_ip}' AND device_port = ${device_port}) THEN "${errorCode.SAME_DEVICE_SETTING}" 
          END AS duplicate`)],
  where: {
    [Op.or]: [
      {
        [Op.and]: [
          {device_name},
          {device_owner}
        ]
      },
      { device_mac },
      {
        [Op.and]: [
          { device_ip },
          { device_port }
        ]
      }
    ]
  },
  raw: true
});

exports.checkUpdateDevice = (device_id, device_name, device_mac, device_ip, device_port, device_owner) => device.findAll({
  attributes: [Sequelize.literal( // same device_ownder dont allow same device name but not self devcie name
    `CASE WHEN (device_name = '${device_name}' AND device_owner = '${device_owner}' AND NOT device_id = '${device_id}') THEN "${errorCode.SAME_DEVICE_NAME}" 
          WHEN (device_mac = '${device_mac}' AND NOT device_id = '${device_id}') THEN "${errorCode.SAME_DEVICE_MAC}" 
          WHEN (device_ip = '${device_ip}' AND device_port = ${device_port} AND NOT device_id = '${device_id}') THEN "${errorCode.SAME_DEVICE_SETTING}" 
          END AS duplicate`)],
  where: {
    [Op.or]: [
      {
        [Op.and]: [
          { device_name },
          { device_owner },
          {
            [Op.not]: [
              {device_id}
            ]
          }
        ]
      },
      {
        [Op.and]: [
          {device_mac},
          {
            [Op.not]: [
              {device_id}
            ]
          }
        ]
      },
      {
        [Op.and]: [
          { device_ip },
          { device_port },
          {
            [Op.not]: [
              { device_id }
            ]
          }
        ]
      }
    ]
  },
  raw: true
});
