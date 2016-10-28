import React from 'react';
import { mount, shallow } from 'enzyme';
import Resources from '../../app/resources/Resources';
import ResourceDocs from '../../app/resources/ResourceDocs'

describe( 'Resources', () => {
  const props = {
    language: 'en',
    isUnitedStates: true,
    segmentio: { track : () => { }},
    kissMetricInfo: { getKissMetricInfo : () => new Promise(resolve => resolve())},
    api: { contentLink: () => { }}
  }

  it( 'has docs in the state', () => {
    const wrapper = mount( <Resources rp={props} /> );

    expect( wrapper.state().docs.length ).to.be.above(0);
  } );

  it( 'renders a ResourceDocs component', () => {
    const wrapper = shallow( <Resources rp={props} /> );

    expect( wrapper.find(ResourceDocs) ).to.have.length(1);
  } );
} );
