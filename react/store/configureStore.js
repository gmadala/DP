import { applyMiddleware, createStore } from 'redux';

import logger from 'redux-logger';
import axiosMiddleware from 'redux-axios-middleware';

import reducers from '../reducers';
import { initApi } from '../config/apiConfig';

const client = initApi();

const middleware = applyMiddleware(
    axiosMiddleware(client),
    logger()
);

export default function configureStore(initialState) {
    return createStore(reducers, initialState, middleware);
}
