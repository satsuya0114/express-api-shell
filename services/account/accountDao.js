const models = require('../../models');

/**
 * check if value exist
 */
exports.checkAccount = account_id => models.account.find({
  attributes: ['account_id'],
  where: {
    account_id
  }
});
