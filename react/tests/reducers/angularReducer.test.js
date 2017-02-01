import { expect } from 'chai'
import reducer from '../../reducers/angularReducer'

describe('angular reducer', ( ) => {
    it('should return the initial state', ( ) => {
        expect(
            reducer()
        ).toEqual({})
    })
})
