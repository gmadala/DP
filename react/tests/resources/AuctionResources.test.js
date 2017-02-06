import React from 'react';
import { mount } from 'enzyme';
import AuctionResources from '../../app/resources/AuctionResources';
import ResourceDocs from '../../app/resources/ResourceDocs'

import docs from '../../data/docsList';
import metric from '../../data/metricList';

describe('AuctionResources', ( ) => {
    const props = {
        language: 'en',
        docs,
        metrics: metric,
        logMetric: sinon.spy()
    }

    const wrapper = mount(
        <AuctionResources
            language={props.language}
            docs={props.docs}
            metrics={props.metrics}
            logMetric={props.logMetric}
        />);

    it('renders a ResourceDocs component', ( ) => {
        expect(wrapper.find( ResourceDocs )).to.have.length( 1 );
    });

    it('calls props.logMetric on mount', ( ) => {
        assert(wrapper.props().logMetric.calledOnce);
    });
});
