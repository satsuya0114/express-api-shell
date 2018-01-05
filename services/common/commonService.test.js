// process.env.ENV = 'dev';
// jest.dontMock('./commonService');
const config = require('config');
const commonService = require('./commonService');
const errorCode = require('../../errorCode/errorCode');

const envParams = config.get('unitTest').commonService;

const sum = (a, b) => (a + b);

test('add 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});

describe('test UUID function', () => {
  test('generateUUIDByTimestamp', () => {
    expect(commonService.generateUUIDByTimestamp()).toHaveLength(36);
  });
  test('generateUUIDByRandom', () => {
    expect(commonService.generateUUIDByRandom()).toHaveLength(36);
  });
  test('generateUUIDByNameSpace', () => {
    const MY_NAMESPACE = commonService.generateUUIDByTimestamp();
    expect(commonService.generateUUIDByNameSpace('Hello, World!', MY_NAMESPACE)).toHaveLength(36);
  });
});

test('generateVerifyCode', () => {
  const result = commonService.generateVerifyCode();
  expect(result).toEqual(expect.objectContaining({
    verify_code: expect.any(String),
    verify_expired_time: expect.any(String),
  }));
});

test('countryCodes', () => {
  const data = commonService.countryCodes();
  expect(data).toEqual(expect.any(Array));
});

describe('specialCharacters case', () => {
  test('specialCharacters return true', () => {
    const result = commonService.specialCharacters('@@@asdfadf');
    expect(result).toBeTruthy();
  });
  test('specialCharacters return false', () => {
    const result = commonService.specialCharacters('asdfasdfasdf-asdfdff-dfdf');
    expect(result).toBeFalsy();
  });
});


describe('sendVerifyCode case', () => {
  const params = {
    account_mobile: envParams.account_mobile,
    account_mobile_country_code: envParams.account_mobile_country_code,
    verify_code: envParams.verify_code
  };
  test('sendVerifyCode success case', () => {
    expect.assertions(1);
    return commonService.sendVerifyCode(params)
      .then((result) => {
        expect(result).toEqual(expect.objectContaining({
          account_mobile: expect.any(String),
          account_mobile_country_code: expect.any(String),
          verify_code: expect.any(String)
        }));
      });
  });
  test('sendVerifyCode fail case', () => {
    expect.assertions(2);
    return commonService.sendVerifyCode({})
      .catch((error) => {
        console.log(error);
        expect(error).toEqual(expect.any(String));
        expect(error).toBe(errorCode.VERIFY_CODE_SEND_FAILD);
      });
  });
});

test('getConfigInfo', () => {
  const result = commonService.getConfigInfo();
  expect(result).toEqual(expect.any(Object));
});
