exports.deviceInfoDao = jest.fn(() => {
  const dbResult = {
    device_id: 'device1',
    device_name: 'device1_for_test',
    device_ip: '127.0.0.2',
    scenemode_id: '1',
    device_port: 1,
    device_zone: 'jp',
    device_did: null,
    device_password: 'wistron',
    deviceAttributes: [
      {
        attribute_name: '解析度',
        deviceAttributeValue: {
          attrvalue_value: '自動'
        }
      },
      {
        attribute_name: '長',
        deviceAttributeValue: {
          attrvalue_value: '720P'
        }
      },
      {
        attribute_name: '寬',
        deviceAttributeValue: {
          attrvalue_value: '1080P'
        }
      }
    ]
  };
  return dbResult;
});
