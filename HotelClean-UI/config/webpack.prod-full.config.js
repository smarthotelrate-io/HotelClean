module.exports = function() {
    const serverConfig = require('./webpack.prod-server');
    const clientConfig = require('./webpack.prod-client');
    const config = [clientConfig, serverConfig];
    return config;
}
