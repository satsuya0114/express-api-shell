module.exports = class ResFormator {
  constructor(result) {
    this._success = false;
    this._result = {};
    this._errorCode = null;
    if (result !== undefined) {
      this._success = true;
      this._result = result;
    }
  }

  set success(v) {
    if (typeof (v) === 'boolean') {
      this._success = v;
    } else {
      throw new TypeError('success is not boolean type');
    }
  }

  set result(v) {
    if (typeof (v) === 'object') {
      this._result = v;
    } else {
      throw new TypeError('result is not object type');
    }
  }

  set errorCode(v) {
    if (typeof (v) !== 'string') {
      throw new TypeError('ERRORCODE is not string type');
    } else {
      this._errorCode = v;
    }
  }

  get fullResponse() {
    if (this._success === true && !this._result) throw new Error('result cannot be blank if no error occur');
    return {
      success: this._success,
      result: this._result,
      errorCode: this._errorCode
    };
  }
};
