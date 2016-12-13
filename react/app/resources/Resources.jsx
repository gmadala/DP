import React, { Component, PropTypes } from 'react';
import counterpart from 'counterpart';
import ResourceVideos from './ResourceVideos';
import ResourceDocs from './ResourceDocs';
import MobileApps from './MobileApps';
import store from '../../store';
import { logAction } from '../../actions/metricActions';

class Resources extends Component {
    constructor( props ) {
        super( props );

        const rp = props.rp;
        const state = store.getState();
        const docsList = state.resource.docs;
        const collateralDocsList = state.resource.collateralDocs;
        const mobileAppsList = state.resource.mobileApps;

        // get fee schedule content link
        docsList[0].url = rp.api.contentLink('/dealer/feeschedule/FeeSchedule', { });

        this.state = {
            language: counterpart.getLocale( ),
            docs: rp.isUnitedStates ? docsList : [],
            collateralDocs: collateralDocsList,
            mobileApps: mobileAppsList,
            isUnitedStates: rp.isUnitedStates || false,
        }

        // log current page view
        store.dispatch(logAction(state.metric.VIEW_RESOURCES_PAGE));
    }

    handleClick = ( metricKey ) => {
        if ( metricKey ) {
            store.dispatch(logAction(metricKey));
            this.props.rp.kissMetricInfo.getKissMetricInfo( ).then(( info ) => {
                this.props.rp.segmentio.track( metricKey, info );
            });
        }
    }

    render( ) {
        return (
            <div className="container">
                <div className="row">
                    {this.state.language === 'en' ? <ResourceVideos handleClick={this.handleClick}/> : null}
                    <ResourceDocs docs={this.state.docs} collateralDocs={this.state.collateralDocs} handleClick={this.handleClick} titleKey="resources.resourceDocs.documents"/>
                    <MobileApps apps={this.state.mobileApps} handleClick={this.handleClick}/>
                </div>
            </div>
        );
    }
}

Resources.propTypes = {
    rp: PropTypes.object,
}

export default Resources;
