/* jshint indent: 2 */

module.exports = (sequelize, DataTypes) => {
  const deviceAttributeValue = sequelize.define('deviceAttributeValue', {
    attrvalue_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    attribute_id: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'deviceAttribute',
        key: 'attribute_id'
      }
    },
    attrvalue_value: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    attrvalue_sequence: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    attrvalue_status: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '1'
    },
    attrvalue_created_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    attrvalue_updated_time: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'deviceAttributeValue'
  });
  deviceAttributeValue.associate = (models) => {
    deviceAttributeValue.belongsTo(models.deviceAttribute, {
      foreignKey: 'attribute_id'
    });
  };
  return deviceAttributeValue;
};
