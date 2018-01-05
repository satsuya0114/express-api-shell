const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
  const account = sequelize.define('account', {
    account_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    // 0: Deactivate, 1: Activate
    account_status: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: 0
    },
    account_email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    account_password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    account_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    account_mobile: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    account_mobile_country_code: {
      type: DataTypes.STRING(6),
      allowNull: false
    },
    verify_code: {
      type: DataTypes.CHAR(4),
      allowNull: true
    },
    verify_expired_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    account_created_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    account_updated_time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'account'
  });
  return account;
};
