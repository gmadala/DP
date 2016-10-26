import React from 'react';
import { mount, shallow } from 'enzyme';
import AuctionResources from '../AuctionResources';
import ResourceDocs from '../ResourceDocs'

describe( '<AuctionResources />', () => {
  var tracked = 0;
  const props = {
    language: 'en',
    isUnitedStates: true,
    segmentio: { track: function() { tracked = tracked++; }},
    kissMetricInfo: { getKissMetricInfo: function() { return new Promise(function(resolve) { resolve(); }) }}
  }

  it( 'has docs in the state', () => {
    const wrapper = mount( <AuctionResources props={props}  /> );

    expect( wrapper.state().docs.length ).to.be.above(0);
  } );

  it( 'renders a ResourceDocs component', () => {
    const wrapper = shallow( <AuctionResources props={props}  /> );

    expect( wrapper.find(ResourceDocs) ).to.have.length(1);
  } );

} );
