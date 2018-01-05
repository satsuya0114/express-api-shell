/* jshint indent: 2 */

module.exports = (sequelize, DataTypes) => {
  const app = sequelize.define('app', {
    app_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    app_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    app_key: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    app_status: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '1'
    },
    app_created_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    app_updated_time: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'app'
  });
  return app;
};
