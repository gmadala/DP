import { expect } from 'chai'
import reducer from '../../reducers/angularReducer'

describe('angular reducer', ( ) => {
    it('should return the initial state', ( ) => {
        expect( // eslint-disable-line
            reducer()
        ).to.be.empty;
    })
})
