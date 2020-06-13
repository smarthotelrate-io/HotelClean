import './semantic/semantic.min.css';
import './styles/fonts.scss';
import './styles/design.scss'
import React from 'react';
import { Provider } from 'react-redux';
import { hydrate } from 'react-dom';
import { ConnectedRouter } from 'connected-react-router';
import configureStore from './store.js';
import Base from './containers/Base';

const initialState = window.INITIAL_STATE || {};
delete window.INITIAL_STATE;

const render = async () => {
    const { store, history } = configureStore(initialState);
    await hydrate((
                    <Provider  store={store}>
                            <ConnectedRouter history={history}>
                                <Base />
                            </ConnectedRouter>
                    </Provider>
        ),
        document.getElementById('root')
    );
};
render();
