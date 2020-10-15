// *** MODULES ***
const express = require('express');
const bodyParser = require('body-parser');
const createError = require('http-errors');
const responseTime = require('response-time');
// *** MIDDLEWARE
const session = require('./middleware/session');
const authenticateMiddleware = require('./middleware/authenticate');
const corsMiddleware = require('./middleware/cors');
const httpLogger = require('./middleware/logger');
// *** ROUTES ***
const authRoute = require('./routes/authentication/authRoute.js');
const userRoute = require('./routes/user/userRoute.js');
const accountRoute = require('./routes/account/accountRoute.js');
// *** CONFIG ***
const _CONFIG = require('./config');
// *** DB ***
const db = require('./db/dbConn');

// *** EXPRESS APP ***
const app = express();
app.use(bodyParser.json());

// Running behind a proxy
app.set('trust proxy', 1);

// *** RESPONSE TIME ***
app.use(responseTime());

// *** SESSION MIDDLEWARE ***
app.use(session);

// *** LOGGER MIDDLEWARE ***
app.use(httpLogger);

// *** CORS ***
app.options('*', corsMiddleware);
app.use(corsMiddleware);

// ***************** UNPROTECTED ROUTES *****************
app.use(`${_CONFIG.server.api_url}/auth`, authRoute);

// Authenticate middleware
app.use(authenticateMiddleware.authenticate);
app.use(authenticateMiddleware.active);

// ***************** PROTECTED ROUTES *****************
app.use(`${_CONFIG.server.api_url}/user`, userRoute);
app.use(`${_CONFIG.server.api_url}/account`, accountRoute);

// *** NOT FOUND CATCH ***
app.use('*', (req, res, next) => {
  next(createError(404));
});

// *** ERROR HANDLER ***
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    message: error.message,
  });
});

module.exports = app;
