const _ = require('lodash');
const uuidv1 = require('uuid/v1');
const uuidv4 = require('uuid/v4');
const uuidv5 = require('uuid/v5');
const moment = require('moment');
const AWS = require('aws-sdk');

const { countries } = require('country-data');
const logger = require('../../logger');
const errorCode = require('../../errorCode/errorCode.js');
const config = require('config');

const sns = new AWS.SNS({
  region: 'ap-northeast-1',
  apiVersion: '2010-03-31'
});

exports.generateUUIDByTimestamp = () => uuidv1();
exports.generateUUIDByRandom = () => uuidv4();
// Note: Custom namespaces should be a UUID string specific to your application!
exports.generateUUIDByNameSpace = (customString, MY_NAMESPACE) => uuidv5(customString, MY_NAMESPACE);

exports.generateVerifyCode = () => {
  const verify_code = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
  const verify_expired_time = moment().add(300, 'seconds').format();
  return {
    verify_code,
    verify_expired_time
  };
};

/**
 * send SMS message to user's mobile
 * params: { account_mobile, message }
 * format: +886 912345678 OR +886 0912345678 OR +8860912345678 OR +886912345678
 */
const sendSMS = params => new Promise((resolve, reject) => {
  logger.info('[commonService][sendSMS] get params:', params);
  const { account_mobile, account_mobile_country_code, message } = params;
  const smsParams = {
    Message: message,
    PhoneNumber: `${account_mobile_country_code} ${account_mobile}`
  };
  sns.publish(smsParams, (err, data) => {
    if (err) {
      logger.error('[commonService][sendSMS] error:', err);
      reject(err);
    } else {
      logger.info('[commonService][sendSMS] success:', data);
      resolve('');
    }
  });
});

/**
 * send verify code to user's mobile using SNS
 * params MUST have account_mobile and verify_code
 */
exports.sendVerifyCode = params => new Promise((resolve, reject) => {
  logger.info('[commonService][sendVerifyCode] get params:', params);
  const { account_mobile, account_mobile_country_code, verify_code } = params;
  const message = `Your NICE verification code is ${verify_code}`;
  sendSMS({ account_mobile, account_mobile_country_code, message })
    .then(() => {
      resolve(params);
    })
    .catch(() => {
      reject(errorCode.VERIFY_CODE_SEND_FAILD);
    });
});

/**
 * get country code array
 */
exports.countryCodes = () => {
  const allCountries = countries.all;
  return _.concat.apply([], _.map(allCountries, c => c.countryCallingCodes));
};

/**
 * check if string contain special characters
 * false : no contain | true : contain
 */
exports.specialCharacters = (string) => {
  // const format = /[!@#$%^&*()+\-=[\]{};':"\\|,.<>/?]+/;
  const format = /[\^@,&=*'"]+/;
  return format.test(string);
};

exports.getConfigInfo = () => {
  const ENV = process.env.ENV;
  logger.info('[commonService][getNodeENV] package\'s ENV:', ENV);
  let configInfo = '';
  if (config.has(`${ENV}`)) {
    configInfo = config.get(ENV);
  } else {
    logger.warn('[commonService][getNodeENV] NODE_ENV:', config.util.getEnv('ENV'), ' mismatch. default use dev.');
    configInfo = config.get('dev');
  }
  return configInfo;
};
