module.exports = (app) => {
  app.use('/apps', require('./controllers/app'));
  app.use('/devices', require('./controllers/device'));
};
