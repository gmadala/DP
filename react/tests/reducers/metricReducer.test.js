import reducer from '../../reducers/metricReducer'
import * as types from '../../actions/actionTypes'

describe('metric reducer', ( ) => {
    it('should return the initial state', ( ) => {
        assert.isUndefined(reducer()[0]);
    })

    it('should handle LOG_METRIC', ( ) => {
        expect(reducer([], {
            type: types.LOG_METRIC,
            payload: 'TEST_METRIC'
        })).deep.equal([
            'TEST_METRIC'
        ])
    })
})
