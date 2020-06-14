/* global __DEVTOOLS__ */
import createRootReducer from './reducers';
import { createStore, applyMiddleware, compose } from 'redux';
import promiseMiddleware from 'redux-promise';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { routerMiddleware } from 'connected-react-router'
import getHistory from './history';

const loggerMiddleware = createLogger({
    level: 'info',
    collapsed: true,
});

function getDebugSessionKey() {
    // You can write custom logic here!
    // By default we try to read the key from ?debug_session=<key> in the address bar
    const matches = window.location.href.match(/[?&]debug_session=([^&]+)\b/);
    let key = matches && matches.length > 0 ? matches[1] : null;
    return key;
}

/**
 * Creates a preconfigured store.
 */
export default function configureStore(initialState = [], req) {
    const history = req && req.url ? getHistory(req.url) : getHistory();
    const initializedRouterMW = routerMiddleware(history);
    let mwList = [
        initializedRouterMW,
        promiseMiddleware,
        thunk.withExtraArgument(),
    ];

    let createStoreWithMiddleware;

    if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__) {
        const DevTools = require('./DevTools').default;
        const { persistState } = require('redux-devtools');
        createStoreWithMiddleware = compose(
            applyMiddleware(...mwList, loggerMiddleware),
            window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
            persistState(getDebugSessionKey())
        )(createStore);

    } else {
        createStoreWithMiddleware = applyMiddleware(...mwList)(createStore);
    }
    const rootReducer = createRootReducer(history);
    const store = createStoreWithMiddleware(rootReducer, initialState);
    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('./reducers', () => {
            const nextRootReducer = require('./reducers');
            store.replaceReducer(nextRootReducer);
        });
    }
    return { history, store };
}

