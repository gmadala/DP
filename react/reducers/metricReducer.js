import * as types from '../actions/actionTypes';

export default function reducer(state = {}, action = {}) {
    switch ( action.type ) {
        case types.LOG_METRIC:
            return Object.assign({}, state, { lastMetric: action.payload })
        default:
            return state;
    }
}
