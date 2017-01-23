import React from 'react';
import { mount } from 'enzyme';
import Resources from '../../app/resources/Resources';
import ResourceDocs from '../../app/resources/ResourceDocs'

import collateralDocs from '../../data/collateralDocsList';
import mobileApps from '../../data/mobileAppsList';
import docs from '../../data/docsList';
import metric from '../../data/metricList';

describe('Resources', ( ) => {
    const props = {
        language: 'en',
        docs,
        collateralDocs,
        mobileApps,
        metrics: metric,
        logMetric: sinon.spy()
    }

    const wrapper = mount(
        <Resources
            language={props.language}
            docs={props.docs}
            collateralDocs={props.collateralDocs}
            mobileApps={props.mobileApps}
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
