/* jshint indent: 2 */

module.exports = (sequelize, DataTypes) => {
  const deviceAttribute = sequelize.define('deviceAttribute', {
    attribute_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    device_id: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'device',
        key: 'device_id'
      }
    },
    attribute_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    attribute_sequence: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    attribute_status: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '1'
    },
    attribute_created_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    attribute_updated_time: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'deviceAttribute'
  });
  deviceAttribute.associate = (models) => {
    deviceAttribute.belongsTo(models.device, {
      foreignKey: 'device_id'
    });
    deviceAttribute.hasOne(models.deviceAttributeValue, {
      foreignKey: 'attribute_id'
    }, { onDelete: 'cascade' });
  };
  return deviceAttribute;
};
