const app = require('../../models').app;

exports.verifyCheck = (app_id, app_key) => app.count({
  where: { app_id, app_key }
});

exports.appCreate = addAppInfo => app.create(addAppInfo);

exports.appUpdate = (updateInfo, app_id) => app.update(updateInfo, {
  where: { app_id }
});
