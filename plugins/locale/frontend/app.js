var plugin = {},
//countlyConfig = require('../../../frontend/express/config', 'dont-enclose'),

    apmConfig = require('../../../config/config', 'dont-enclose'),
    langs = require('../api/utils/langs.js');

(function (plugin) {
    plugin.init = function (app, countlyDb) {
        app.get(apmConfig.path + '/dashboard', function (req, res, next) {
            res.expose({
                languages: langs.languages
            }, 'countlyGlobalLang');
            next();
        });
    };
}(plugin));

module.exports = plugin;