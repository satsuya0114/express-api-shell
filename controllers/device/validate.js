const Joi = require('joi');
const { validateFormat } = require('../../utils/validator');

exports.shareDevices = (params) => {
  const schema = Joi.object().keys({
    account_id: Joi.string().required(),
    devices: Joi.array().min(1).required().items(
      Joi.string()
    )
  });
  const validator = Joi.validate(params, schema, { abortEarly: false });
  return validateFormat(validator);
};

exports.createDevice = (params) => {
  const schema = Joi.object().keys({
    device_name: Joi.string().regex(/[\^@,&=*'"]+/, {invert: true}).required(),
    device_ip: Joi.string().required(),
    device_owner: Joi.string().min(1).required(),
    device_attribute: Joi.array().items(Joi.object({
      name: Joi.string().required(),
      value: Joi.any().required()
    })),
    scenemode_id: Joi.string().required(),
    device_port: Joi.number().integer().min(0).max(9999)
      .required(),
    device_zone: Joi.string(),
    device_mac: Joi.string().required(),
    device_did: Joi.string().required(),
    device_password: Joi.string().required()
  });
  const validator = Joi.validate(params, schema, { abortEarly: false });
  return validateFormat(validator);
};

exports.updateDevice = (params) => {
  const schema = Joi.object().keys({
    device_id: Joi.string().required(),
    device_name: Joi.string().regex(/[\^@,&=*'"]+/, { invert: true }).required(),
    device_ip: Joi.string().required(),
    device_attribute: Joi.array().items(Joi.object({
      name: Joi.string().required(),
      value: Joi.any().required()
    })),
    scenemode_id: Joi.string().required(),
    device_port: Joi.number().integer().min(0).max(9999)
      .required(),
    device_zone: Joi.string(),
    device_mac: Joi.string().required(),
    device_did: Joi.string().required(),
    device_password: Joi.string().required()
  });
  const validator = Joi.validate(params, schema, { abortEarly: false });
  return validateFormat(validator);
};
