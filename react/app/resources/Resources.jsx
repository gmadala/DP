import React, { Component, PropTypes } from 'react';
import counterpart from 'counterpart';
import ResourceVideos from './ResourceVideos';
import ResourceDocs from './ResourceDocs';
import MobileApps from './MobileApps';

class Resources extends Component {
    componentDidMount() {
        this.props.logMetric(
            {
                metric: this.props.metrics.VIEW_RESOURCES_PAGE,
                kissMetricInfo: this.props.kissMetricInfo,
                segmentio: this.props.segmentio
            }
        );
        counterpart.setLocale(this.props.language); // set language
    }

    render( ) {
        return (
            <div className="container">
                <div className="row">
                    {this.props.language === 'en' ? <ResourceVideos handleClick={this.props.logMetric}/> : null}
                    <ResourceDocs docs={this.props.docs} collateralDocs={this.props.collateralDocs} handleClick={this.props.logMetric} titleKey="resources.resourceDocs.documents"/>
                    <MobileApps apps={this.props.mobileApps} handleClick={this.props.logMetric}/>
                </div>
            </div>
        );
    }
}

Resources.propTypes = {
    language: PropTypes.string.isRequired,
    docs: PropTypes.array.isRequired,
    collateralDocs: PropTypes.array.isRequired,
    mobileApps: PropTypes.array.isRequired,
    metrics: PropTypes.object.isRequired,
    logMetric: PropTypes.func.isRequired,
    kissMetricInfo: PropTypes.any.isRequired,
    segmentio: PropTypes.any.isRequired
}

export default Resources;
