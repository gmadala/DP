import React, { Component, PropTypes } from 'react';
import counterpart from 'counterpart';
import ResourceDocs from './ResourceDocs';

class AuctionResources extends Component {
    componentDidMount() {
        this.props.logMetric(
            {
                metric: this.props.metrics.VIEW_RESOURCES_PAGE,
                kissMetricInfo: this.props.kissMetricInfo,
                segmentio: this.props.segmentio
            }
        ); // log page view
        counterpart.setLocale(this.props.language); // set language
    }

    render( ) {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <ResourceDocs docs={this.props.docs} handleClick={this.props.logMetric} titleKey="resources.resourceDocs.ngcDocuments" classes="col-md-12"/>
                    </div>
                </div>
            </div>
        );
    }
}

AuctionResources.propTypes = {
    docs: PropTypes.array.isRequired,
    metrics: PropTypes.object.isRequired,
    logMetric: PropTypes.func.isRequired,
    language: PropTypes.string.isRequired,
    kissMetricInfo: PropTypes.any.isRequired,
    segmentio: PropTypes.any.isRequired
}

export default AuctionResources;
