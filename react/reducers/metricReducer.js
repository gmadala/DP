import * as types from '../actions/actionTypes';

export default function reducer(state = [], action = {}) {
    switch ( action.type ) {
        case types.LOG_METRIC:
            {
                action.payload.kissMetricInfo.getKissMetricInfo( ).then(( result ) => {
                    action.payload.segmentio.track( action.payload.metric, result );
                });
                return Object.assign([], state, [ action.payload.metric ])
            }
        default:
            return state;
    }
}
