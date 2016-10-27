import React from 'react';
import { shallow } from 'enzyme';
import ResourceVideos from '../ResourceVideos.js';
import Video from '../../shared/Video';

describe( '<ResourceVideos />', () => {
  it( 'renders two videos', () => {
    const wrapper = shallow( <ResourceVideos /> );

    expect( wrapper.find(Video) ).to.have.length( 2 );
  } );
} );
