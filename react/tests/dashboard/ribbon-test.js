import React from 'react';
import { shallow } from 'enzyme';
import Ribbon from '../../app/dashboard/Ribbon'

describe.only('Ribbon', ( ) => {
    // const props = {
    //     floorplancount: '50',
    //     floorplanflag: 'true',
    //     navfloorplan: {
    //         pending: 'true',
    //     },
    // }

    it('should test for the prop types', ( ) => {
        const navfloorplan = sinon.spy( );
        const wrapper = shallow( <Ribbon onClick={navfloorplan}/>);
        wrapper.find('button').simulate('click');
        expect(navfloorplan.calledOnce).to.equal(true);
    });
});
