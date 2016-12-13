import { applyMiddleware, createStore } from 'redux';

import logger from 'redux-logger';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';
import axios from 'axios';

import reducers from '../reducers';

axios.defaults.baseURL = '';

const middleware = applyMiddleware(
    promise(),
    thunk,
    logger()
);

export default function configureStore(initialState) {
    return createStore(reducers, initialState, middleware);
}
