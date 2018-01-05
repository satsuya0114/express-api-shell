const _ = require('lodash');

/**
 * format Joi validate result
 * paramter: Joi validate result
 * return: { error: [boolean], errorKeys: [string] }
 * errorKeys will be returned if error is true
 */
exports.validateFormat = (validateResult) => {
  if (validateResult.error) {
    const errorArray = validateResult.error.details;
    const errorKeys = _.uniq(_.map(errorArray, o => _.join(o.path)));
    return {
      error: true,
      errorKeys
    };
  }
  return {
    error: false
  };
};
