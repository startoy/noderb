/**
 * @name nodejs_api_rabbitmq
 * @description nodejs_api_rabbitmq
 * @author Peerapat Suksri
 * @version 18.04.00.01
 */

import express from 'express';
import logger from 'morgan';
import path from 'path';
import createError from 'http-errors';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import rfs from 'rotating-file-stream';

import rpcRouter from './routes/rpc';
import directRouter from './routes/direct';
import { log } from './lib/util';
import { isDev, sv } from './lib/config';

var app = express();
var logFile = 'express.log';
var logDirectory = path.join(__dirname, '../logs');

/* isDev
  ? log.info('Log path: ' + path.join(logDirectory, logFile))
  : log.info(''); */

fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

var accessLogStream = rfs(logFile, {
  interval: '1d', // daily rotate file
  path: logDirectory
});

logger.format(
  'FWGLogFormat',
  ':date[iso] : :method :url :status :response-time ms - :res[content-length]'
);

app.use(
  logger('FWGLogFormat', {
    stream: accessLogStream
  })
);

isDev ? app.use(logger('dev')) : log.info('Use Production Logging..');

// View engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Router Setup
app.get('/', async (req, res, next) => {
  // res.redirect('/rpc');
  res.render('info', {
    message:
      'THIS IS MESSAGE FROM ROUTER INDEX PAGE, YOU SHOULD SEE THIS MESSAGE'
  });
});

app.get('/version', async (req, res, next) => {
  // res.redirect('/rpc');
  res.json(sv);
});

app.use('/rpc', rpcRouter);
app.use('/direct', directRouter);

log.info('NodeRB Version: ' + sv.version);

// catch 404 then redirect to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in dev
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
