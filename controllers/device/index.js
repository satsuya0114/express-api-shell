const express = require('express');
const controller = require('./deviceController');
const middlewares = require('../../middlewares');

const router = express.Router();
router.use('/', middlewares.verifyPermission);

router.post('/', controller.createDevice);
router.get('/:device_id', controller.getDeviceInfo);
router.put('/:device_id', controller.updateDevice);
router.delete('/:device_id', controller.deleteDevice);
// through middleware to response result
router.use('/', middlewares.response);
module.exports = router;
