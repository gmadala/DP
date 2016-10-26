import React from 'react';
import { mount, shallow } from 'enzyme';
import Resources from '../Resources';
import ResourceDocs from '../ResourceDocs'

describe( '<Resources />', () => {
  const props = {
    language: 'en',
    isUnitedStates: true,
    segmentio: { track: function() { }},
    kissMetricInfo: { getKissMetricInfo: function() { return new Promise(function(resolve) { resolve(); }) }},
    api: { contentLink: function() { }}
  }

  it( 'has docs in the state', () => {
    const wrapper = mount( <Resources props={props}  /> );

    expect( wrapper.state().docs.length ).to.be.above(0);
  } );

  it( 'renders a ResourceDocs component', () => {
    const wrapper = shallow( <Resources props={props}  /> );

    expect( wrapper.find(ResourceDocs) ).to.have.length(1);
  } );

} );
