import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import { legacy_createStore as createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

const store = createStore(rootReducer, compose(applyMiddleware(thunk)));

ReactDOM.render(
    <GoogleOAuthProvider clientId="40448021623-66aon863hbi60vm56ul6ma1ol0cgmpj2">
        <Provider store={store}>
            <App />
        </Provider>
    </GoogleOAuthProvider>,
    document.getElementById('root')
);