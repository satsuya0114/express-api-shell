const Joi = require('joi');
const { validateFormat } = require('../../utils/validator');

exports.updateApplicationInfo = (value) => {
  const schema = Joi.object().keys({
    app_id: Joi.string().required(),
    app_name: Joi.string().required()
  });
  const validator = Joi.validate(value, schema, { abortEarly: false });
  return validateFormat(validator);
};

exports.addApplication = (value) => {
  const schema = Joi.object().keys({
    app_name: Joi.string().required()
  });
  const validator = Joi.validate(value, schema, { abortEarly: false });
  return validateFormat(validator);
};

exports.verifyPermission = (value) => {
  const schema = Joi.object().keys({
    app_id: Joi.string().required(),
    app_key: Joi.string().required()
  });
  const validator = Joi.validate(value, schema, { abortEarly: false });
  return validateFormat(validator);
};

