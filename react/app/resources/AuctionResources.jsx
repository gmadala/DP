import React, { Component, PropTypes } from 'react';
import ResourceDocs from './ResourceDocs';

class AuctionResources extends Component {
    componentDidMount() {
        this.props.logMetric(this.props.metrics.VIEW_RESOURCES_PAGE); // log page view
    }

    render( ) {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <ResourceDocs
                            docs={this.props.docs}
                            handleClick={this.props.logMetric}
                            titleKey="resources.resourceDocs.ngcDocuments"
                            classes="col-md-12"
                            isUnitedStates={this.props.isUnitedStates}
                        />
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
    isUnitedStates: PropTypes.bool.isRequired
}

export default AuctionResources;
