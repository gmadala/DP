import React, { Component, PropTypes } from 'react';
import counterpart from 'counterpart';
import ResourceDocs from './ResourceDocs';
import auctionDocsList from './data/_auctionDocsList';
import metric from '../shared/metric';

class AuctionResources extends Component {
    constructor( props ) {
        super( props );

        const rp = props.rp;

        // set current language
        counterpart.setLocale(rp.language.substring( 0, 2 ));

        this.state = {
            language: counterpart.getLocale( ),
            docs: rp.isUnitedStates
                ? auctionDocsList
                : [],
            isUnitedStates: rp.isUnitedStates || false
        }

        // log current page view
        this.handleClick( metric.VIEW_RESOURCES_PAGE );
    }

    handleClick = ({ metricKey }) => {
        if ( metricKey ) {
            this.props.rp.kissMetricInfo.getKissMetricInfo( ).then(( info ) => {
                this.props.rp.segmentio.track( metricKey, info );
            });
        }
    }

    render( ) {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <ResourceDocs docs={this.state.docs} handleClick={this.handleClick} titleKey="resources.resourceDocs.ngcDocuments" classes="col-md-12"/>
                    </div>
                </div>
            </div>
        );
    }
}

AuctionResources.propTypes = {
    rp: PropTypes.object.isRequired
}

export default AuctionResources;
