import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import reduxThunk from 'redux-thunk';

import reducers from '../reducers';

const debug = process.env.NODE_ENV !== 'production';

let middleware = [reduxThunk]
if (debug) {
    middleware = [...middleware, logger()]
}

const createStoreWithMiddleware = applyMiddleware(...middleware)(createStore);

export default function configureStore(initialState) {
    return createStoreWithMiddleware(reducers, initialState);
}
