const express = require('express');
const controller = require('./appController');
const middlewares = require('../../middlewares');

const router = express.Router();
router.post('/', controller.addApplication);
router.put('/:app_id', middlewares.verifyPermission, controller.updateApplicationInfo);
router.use('/', middlewares.response);

module.exports = router;
