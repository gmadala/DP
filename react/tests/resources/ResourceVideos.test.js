import React from 'react';
import { shallow } from 'enzyme';
import ResourceVideos from '../../app/resources/ResourceVideos';
import Video from '../../app/shared/Video';

describe('ResourceVideos', ( ) => {
    it('renders two videos', ( ) => {
        const wrapper = shallow( < ResourceVideos language="en" / > );

        expect(wrapper.find( Video )).to.have.length( 2 );
    });
});
