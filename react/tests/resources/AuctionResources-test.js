import React from 'react';
import { mount, shallow } from 'enzyme';
import AuctionResources from '../../app/resources/AuctionResources';
import ResourceDocs from '../../app/resources/ResourceDocs';

describe('AuctionResources', ( ) => {
    const props = {
        language: 'en',
        isUnitedStates: true,
        segmentio: {
            track: ( ) => {}
        },
        kissMetricInfo: {
            getKissMetricInfo: ( ) => new Promise(resolve => resolve( ))
        }
    }

    it('has docs in the state', ( ) => {
        const wrapper = mount( <AuctionResources rp={props}/> );

        expect( wrapper.state( ).docs.length ).to.be.above( 0 );
    });

    it('renders a ResourceDocs component', ( ) => {
        const wrapper = shallow( <AuctionResources rp={props}/> );

        expect(wrapper.find( ResourceDocs )).to.have.length( 1 );
    });
});
