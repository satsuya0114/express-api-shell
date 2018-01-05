/* jshint indent: 2 */

module.exports = (sequelize, DataTypes) => {
  const device = sequelize.define('device', {
    device_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    device_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    device_ip: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    device_owner: {
      type: DataTypes.CHAR(36),
      allowNull: false
    },
    scenemode_id: {
      type: DataTypes.CHAR(36),
      allowNull: false
    },
    device_url: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    device_streaming_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    device_mac: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    device_port: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    device_zone: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    device_did: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    device_password: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    device_status: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '1'
    },
    device_created_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    device_update_time: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'device'
  });
  device.associate = (models) => {
    device.hasMany(models.deviceAttribute, {
      foreignKey: 'device_id'
    }, { onDelete: 'cascade' });
  };
  return device;
};
