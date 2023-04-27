/**
 * Created by Miguel Pazo (http://miguelpazo.com)
 */

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();
const server = require('http').Server(app);

//config
const config = require('../config/config.json');
const router = require('../routes/_index')();

//middlewares
const midTrimmer = require('../middleware/trimmer');

app.use(cookieParser());
app.use(session({secret: config.app.key}));

//web config
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//adding middlewares
app.use(midTrimmer);
app.use(express.static(path.join(__dirname, '../public')));
app.use(router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    res.locals.baseUrl = config.app.baseUrl;

    if (err.name == 'IpDeniedError') {
        res.status(403);
        err.stack = null;
        res.locals.error = err;
    } else {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = config.app.env === 'dev' ? err : {};

        // render the error page
        res.status(err.status || 500);
    }

    res.render('error');
});

module.exports = {app: app, server: server};
