import types from '../actions/actionTypes';

export default function reducer(state = {}, action = {}) {
    switch (action.type) {
        case types.SET_ANGULAR_OBJ: {
            const newState = Object.assign({}, state);
            newState[action.payload.name] = action.payload.func;
            return newState;
        }
        case types.LOG_METRIC: {
            state.KissMetric.getKissMetricInfo( ).then(( result ) => {
                state.SegmentIO.track( action.payload, result );
            });
            return state;
        }
        default:
            return state;
    }
}
