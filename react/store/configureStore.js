import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import reduxThunk from 'redux-thunk';

import reducers from '../reducers';

const createStoreWithMiddleware = applyMiddleware(
    reduxThunk,
    logger()
)(createStore);

export default function configureStore(initialState) {
    return createStoreWithMiddleware(reducers, initialState);
}
