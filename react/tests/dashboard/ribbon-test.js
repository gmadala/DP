import React from 'react';
import { shallow } from 'enzyme';

import Ribbon from '../../app/dashboard/Ribbon'

describe('Ribbon', ( ) => {
    it('should test for the prop types', ( ) => {
        const navfloorplan = sinon.spy( );
        const wrapper = shallow( <Ribbon navfloorplan={navfloorplan}/>);
        wrapper.find('button').simulate('click');
        expect(navfloorplan.calledOnce).to.equal(true);
    });
});
