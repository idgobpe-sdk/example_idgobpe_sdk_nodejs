/**
 * Created by Miguel Pazo (http://miguelpazo.com)
 */

const configAuth = require('./../config/idgobpe_config.json');
const config = require('./../config/config.json');
const randomstring = require('randomstring');
const idgobpe = require('idgobpe_sdk2');

let controller = {
    getIndex: (req, res, next) => {
        req.session.state = randomstring.generate();
        setIDGobPeConfig(req.session.state);

        return res.render('login', {url: idgobpe.getLoginUrl()});
    },

    getAuthEndpoint: async (req, res, next) => {
        if (req.query.error) {
            console.log(req.query.error + "\n" + req.query.error_description);
            return res.redirect(config.app.baseUrl);
        }

        if (req.session.state !== req.query.state) {
            console.log("Wrong state");
            return res.redirect(config.app.baseUrl);
        }

        try {
            setIDGobPeConfig(null);

            let tokens = await idgobpe.getTokens(req.query.code);

            if (tokens == null) {
                console.log("Error consuming token endpoint");
                return res.redirect(config.app.baseUrl);
            }

            let userInfo = await idgobpe.getUserInfo(tokens.access_token);

            if (tokens == null) {
                console.log("Error consuming userinfo endpoint");
                return res.redirect(config.app.baseUrl);
            }

            req.session.user = userInfo;
            req.session.logoutUri = idgobpe.getLogoutUri(config.app.baseUrl);

            return res.redirect(config.app.baseUrl + '/home');
        } catch (err) {
            console.log(err);
        }

        return res.redirect(config.app.baseUrl);
    }
};

function setIDGobPeConfig(state) {
    idgobpe.setConfig({
        redirectUri: config.app.baseUrl + '/auth-endpoint',
        scopes: [
            idgobpe.constAuth.SCOPE_PROFILE
        ],
        acr: idgobpe.constAuth.ACR_CERTIFICATE_DNIE,
        state: state,
        config: configAuth
    });
}

module.exports = controller;
