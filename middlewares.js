const appService = require('./services/app/appService');
const StatusCode = require('./errorCode/statusCode');
const ErrorCode = require('./errorCode/errorCode');
const validate = require('./controllers/app/validate');
const logger = require('./logger');

exports.timeStart = (req, res, next) => {
  const startTime = new Date();
  req.startTime = startTime;
  next();
};

exports.verifyPermission = (req, res, next) => {
  let validateTarget = null;
  if (req.headers.authorization && req.headers.authorization.search(/JSON/i) === 0) {
    try {
      validateTarget = JSON.parse(req.headers.authorization.slice(4));
    } catch (error) {
      validateTarget = null;
    }
    if (!validateTarget) {
      res.status(StatusCode.AUTHENTICATION_ERROR).send({ errorCode: ErrorCode.ARGUMENTS_ERROR('Authorization') });
      return;
    }
  } else {
    res.status(StatusCode.AUTHENTICATION_ERROR).send({ errorCode: ErrorCode.ARGUMENTS_ERROR('Authorization of http headers') });
    return;
  }
  const {app_key, app_id} = validateTarget;
  const validateResult = validate.verifyPermission({ app_id, app_key });
  if (validateResult.error) {
    res.status(StatusCode.MISSING_ARGUMENTS).send({ errorCode: ErrorCode.ARGUMENTS_ERROR(validateResult.errorKeys) });
  } else {
    appService.verifyApplication(app_id, app_key).then((dbResult) => {
      if (dbResult.isExisted) {
        next();
      } else {
        res.status(StatusCode.AUTHENTICATION_ERROR).send({ errorCode: dbResult.errorCode });
      }
    }).catch(() => res.status(StatusCode.INTERNAL_ERROR).send({ errorCode: ErrorCode.INTERNAL_ERROR }));
  }
};

exports.response = (req, res, next) => {
  console.log('through middleware response');
  if (typeof req.ctrlResult === 'undefined') {
    logger.error('[middlewares][response][Error] There is no ctrlResult in require.');
    next(); // When the request does not API, it would not have ctrlResult and should skip the following handling.
    return;
  }
  const ctrlResult = req.ctrlResult.fullResponse;
  const time_used = new Date() - req.startTime;
  if (ctrlResult.success) { // api success
    const result = ctrlResult.result;
    result.time_used = time_used;
    res.status(StatusCode.OK).json(result);
  } else { // api error handle
    const errorCode = ctrlResult.errorCode;
    const result = {
      errorCode,
      time_used
    };
    if (result.errorCode) {
      const status = (StatusCode[errorCode]) ? StatusCode[errorCode] : 400; // 400 for default
      res.status(status).send(result);
    } else {
      result.errorCode = ErrorCode.INTERNAL_ERROR;
      res.status(StatusCode.INTERNAL_ERROR).send(result);
    }
  }
};
