const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const bodyParser = require('body-parser');
const compression = require('compression');
const expressSession = require('express-session');
const middlewares = require('./middlewares');
// Set up the express app
const app = express();


// Log requests to the console.
app.use(logger('dev'));
// compress all response obj
app.use(compression());
// express session
app.use(expressSession({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

const corsOptions = {
  origin: '*', // Access-Control-Allow-Origin
  methods: 'GET,PUT,POST,DELETE,OPTIONS', // Access-Control-Allow-Methods
  allowedHeaders: ['Accept', 'Origin', 'Content-Type', 'Authorization'], // Access-Control-Allow-Headers
  credentials: true, // Access-Control-Allow-Credentials
  preflightContinue: false
};
app.use(cors(corsOptions));

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(middlewares.timeStart);

require('./routes')(app);

module.exports = app;
