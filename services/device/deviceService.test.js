const deviceService = require('./deviceService');
const deviceDao = require('../../__mocks__/deviceDao');

const deviceInfoDao = jest.fn(() => {
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
})
  .mockImplementationOnce(() => 'first call');

console.log(deviceInfoDao());

test('test mock function', () => {
  expect.assertions(5);
  return deviceService.deviceInfoDataHandle(deviceInfoDao())
    .then((result) => {
      expect(result).toEqual(expect.any(Object));
      expect(result).toEqual(expect.objectContaining({
        device_id: expect.any(String),
        device_name: expect.any(String),
        device_ip: expect.any(String),
        scenemode_id: expect.any(String),
        device_port: expect.any(Number),
        device_attribute: expect.any(Array)
      }));
      expect(result).toHaveProperty('device_did');
      expect(result).toHaveProperty('device_password');
      expect(result).toHaveProperty('device_zone');
    });
});

test('test mock function in mock files', () => {
  expect.assertions(5);
  return deviceService.deviceInfoDataHandle(deviceDao.deviceInfoDao())
    .then((result) => {
      expect(result).toEqual(expect.any(Object));
      expect(result).toEqual(expect.objectContaining({
        device_id: expect.any(String),
        device_name: expect.any(String),
        device_ip: expect.any(String),
        scenemode_id: expect.any(String),
        device_port: expect.any(Number),
        device_attribute: expect.any(Array)
      }));
      expect(result).toHaveProperty('device_did');
      expect(result).toHaveProperty('device_password');
      expect(result).toHaveProperty('device_zone');
    });
});
