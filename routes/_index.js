/**
 * Created by Miguel Pazo (http://miguelpazo.com)
 */

const express = require('express');
const router = express.Router();
const loginController = require('./loginController');
const homeController = require('./homeController');

module.exports = () => {

    router.get('', (req, res, next) => {
        loginController.getIndex(req, res, next);
    });
    router.get('/auth-endpoint', (req, res, next) => {
        loginController.getAuthEndpoint(req, res, next);
    });
    router.get('/home', (req, res, next) => {
        homeController.getIndex(req, res, next);
    });
    router.get('/logout', (req, res, next) => {
        homeController.getLogout(req, res, next);
    });

    return router;

};
