import express from 'express';
import React from 'react';
const expressStaticGzip = require('express-static-gzip');
const server = express();

server.disable('x-powered-by');

server.use(function(req, res, next){
    res.header('X-XSS-Protection', '1; mode=block');
    res.header('X-Frame-Options', 'deny');
    res.header('X-Content-Type-Options', 'nosniff');
    next();
});

const cookiesMiddleware = require('universal-cookie-express');

import bodyParser from 'body-parser';

const ignoreFavicon = (req, res, next) => {
    if (req.originalUrl === '/favicon.ico') {
        res.status(204).json({nope: true});
    } else {
        next();
    }
};



server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(cookiesMiddleware());
server.use(ignoreFavicon);
server.use(`/assets`, express.static('src/assets'));
server.use('/dist',express.static('dist'));
let isBuilt = false;

const isDev = process.env.NODE_ENV === undefined || process.env.NODE_ENV === 'local';
const done = () =>
    !isBuilt &&
    server.listen(3025, () => {
        isBuilt = true;
        const url = isDev ? 'http://localhost' : process.env.BASE_URL;
        console.log(`BUILD COMPLETE -- Listening @${url}:3000/  ENV:${process.env.NODE_ENV}`)
    });

if (isDev) {
    const configDevClient  = require('../../config/webpack.dev-client.js');
    const configDevServer= require('../../config/webpack.dev-server.js');
    const publicPath = configDevClient.output.publicPath;
    const webpack = require('webpack');
    const webpackDevMiddleware = require("webpack-dev-middleware");
    const webpackHotMiddleware = require("webpack-hot-middleware");
    const webpackHotServerMiddleware = require("webpack-hot-server-middleware");
    const compiler = webpack([configDevClient, configDevServer]);
    const clientCompiler = compiler.compilers[0];
    const options = { publicPath, stats: { colors: true } };
    const devMiddleware = webpackDevMiddleware(compiler, options);

    server.use(devMiddleware);
    server.use(webpackHotMiddleware(clientCompiler));
    server.use(webpackHotServerMiddleware(compiler));

    devMiddleware.waitUntilValid(done)
} else {
    const render = require('../../dist/prod-server-bundle.js').default;
    const clientStats = require('../../dist/stats');
    server.use(
        expressStaticGzip('dist', {
            orderPreference: ['br', 'gz'],
            enableBrotli: true,
        }),
    );
    server.use(render({ clientStats, env: process.env }));
    done();
}


