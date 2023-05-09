/**
 * Created by Miguel Pazo (http://miguelpazo.com)
 */

const config = require('./../config/config.json');
const idgobpe = require('idgobpe_sdk2');

let controller = {
    getIndex: (req, res, next) => {
        return res.render('home', {user: req.session.user});
    },

    getLogout: (req, res, next) => {
        let logoutUri = idgobpe.getLogoutUri(config.app.baseUrl);
        return res.redirect(logoutUri);
    }
};

module.exports = controller;
