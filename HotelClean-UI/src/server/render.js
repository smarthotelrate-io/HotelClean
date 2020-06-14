import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { flushChunkNames, clearChunks } from 'jaybe-react-universal-componentv4/server';
import flushChunks from 'webpack-flush-chunks';
import { Provider } from 'react-redux';
import { matchRoutes, renderRoutes } from 'react-router-config';
import routes from '../routing/ServerRoutes.js';
import configureStore from '../store.js';
const StaticRouter = require('react-router-dom').StaticRouter;
import serialize from 'serialize-javascript';
import url from 'url';


const renderFullPage = (html, preloadedState, js, cssHash, styles, env) => {
    return (`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>CleanHotel - a &lt;Trave/Scrum&gt; Hackathon project by Smart Hotel Rate</title>
        <meta charset="UTF-8">
        <meta name="robots" content="noindex">
        ${styles}
      </head>
      <body>
        <div style="min-height: 700px;" id="root">${html}</div>
        <script>
        window.INITIAL_STATE=${serialize(preloadedState)};
        </script>  
         ${js}${cssHash}
      </body>
    </html>
  `);
};

const loadRouteDependencies =  async (req, store) => {
    const matchedRoutes = matchRoutes(routes, url.parse(req.url).pathname);

    const promises = matchedRoutes.map(async ({ route, match }) => {
        if (route.universal && (route.component || route.render)) {
            await import(`../pages/${route.page}`)
                .then(async comp => {
                    if (comp.default.fetchData) {
                        console.log(comp.default.fetchData)
                        await store.dispatch(comp.default.fetchData());
                    }
                    else {
                        Promise.resolve();
                    }
                });
        }
        Promise.resolve(null);
    });

    return Promise.all(promises);
};

export default ({ clientStats, env }) => (req, res) => {
    if (req.url === '/index.html') {
        req.url = '/'
    }
    const { store, history } = configureStore({}, req);
    let contextStaticRouter = {};
    loadRouteDependencies(req, store, req.universalCookies, history)
        .then(() => {
            const app = (
                        <Provider store={store}>
                                <StaticRouter location={req.url} context={contextStaticRouter}>
                                    {renderRoutes(routes)}
                                </StaticRouter>
                        </Provider>
            );
            clearChunks();
            const html = ReactDOMServer.renderToString(app);
            const chunkNames = flushChunkNames();
            const { js, styles, cssHash } = flushChunks(clientStats, {
                chunkNames,
            });
            const preloadedState = store.getState();
            res.status(200).send(renderFullPage(html, preloadedState, js, cssHash, styles, env));

        })
        .catch((err) => {
            console.error(err);
        });
};
