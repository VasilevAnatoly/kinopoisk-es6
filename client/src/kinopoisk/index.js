// ========== Importing react lib ==========//
import React from 'react';
import ReactDOM from 'react-dom';

// ========== Importing Routing lib ========== //
import {
    createBrowserHistory
} from 'history';

// ========== Importing styles ========== //
import './styles/core.css'

import 'bootstrap/dist/css/bootstrap.min.css';

// ========== Importing main app ========== //
import createStore from './store/createStore';
import AppContainer from './containers/AppContainer';
import routes from './routes.jsx'

import {
    loadState,
    saveState
} from 'libs/localStorage';

import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';

window.jQuery = window.$ = $;

// ========================================================
// Browser History Setup
// ========================================================

const history = createBrowserHistory({
    basename: '/top',
});

const initialState = loadState();
const store = createStore(initialState, history);

store.subscribe(() => {
    saveState({
        apiStore: {}
    });
});

if (process.env.NODE_ENV === 'development') {
    if (window.devToolsExtension) {
        window.devToolsExtension.open()
    }
}

const MOUNT_NODE = document.getElementById('react');
let render = (routerKey = null) => {
    ReactDOM.render( <
        AppContainer store = {
            store
        }
        routes = {
            routes
        }
        history = {
            history
        }
        />,
        MOUNT_NODE
    )
}

render();