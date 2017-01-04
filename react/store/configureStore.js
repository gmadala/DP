import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import reduxThunk from 'redux-thunk';

import reducers from '../reducers';

const middleware = applyMiddleware(
    reduxThunk,
    logger()
)(createStore);

export default function configureStore(initialState) {
    return createStore(reducers, initialState, middleware);
}
