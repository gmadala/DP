import { expect } from 'chai'
import reducer from '../../reducers/angularReducer'
import types from '../../actions/actionTypes'

describe('angular reducer', ( ) => {
    it('should return the initial state', ( ) => {
        expect( // eslint-disable-line
            reducer()
        ).to.be.empty;
    })

    it('should handle SET_ANGULAR_OBJ', () => {
        const payload = {
            name: 'TEST_ANGULAR_OBJ',
            func: () => {}
        }
        expect(
            reducer({}, {
                type: types.SET_ANGULAR_OBJ,
                payload
            })
        ).to.eql({
            TEST_ANGULAR_OBJ: payload.func
        })
    })

    it('should handle LOG_METRIC', () => {
        expect(reducer({}, { // eslint-disable-line
            type: types.LOG_METRIC,
            payload: 'metric string'
        })).to.be.empty
    })
})
