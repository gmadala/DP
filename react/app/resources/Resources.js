import React, { Component, PropTypes } from 'react';
import ResourceDocs from './ResourceDocs';
import MobileApps from './MobileApps';

class Resources extends Component {
    componentDidMount() {
        this.props.logMetric(this.props.metrics.VIEW_RESOURCES_PAGE);
    }

    render( ) {
        return (
            <div className="container">
                <div className="row">
                    <ResourceDocs
                        docs={this.props.docs}
                        collateralDocs={this.props.collateralDocs}
                        handleClick={this.props.logMetric}
                        titleKey="resources.resourceDocs.documents"
                        isUnitedStates={this.props.isUnitedStates}
                    />
                    <MobileApps apps={this.props.mobileApps} handleClick={this.props.logMetric}/>
                </div>
            </div>
        );
    }
}

Resources.propTypes = {
    docs: PropTypes.array.isRequired,
    collateralDocs: PropTypes.array.isRequired,
    mobileApps: PropTypes.array.isRequired,
    metrics: PropTypes.object.isRequired,
    logMetric: PropTypes.func.isRequired,
    isUnitedStates: PropTypes.bool.isRequired
}

export default Resources;
