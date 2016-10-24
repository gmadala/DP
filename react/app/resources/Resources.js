import React, { Component, PropTypes } from 'react';
import counterpart from 'counterpart';
import ResourceVideos from './ResourceVideos';
import ResourceDocs from './ResourceDocs';
import MobileApps from './MobileApps';
import collateralDocsList from './data/_collateralDocsList';
import mobileAppsList from './data/_mobileAppsList';
import docsList from './data/_docsList';

class Resources extends Component {
    constructor(props) {
        super(props);

        // get fee schedule content link
        docsList[0].url = props.props.api.contentLink('/dealer/feeschedule/FeeSchedule', {});

        // set current language
        counterpart.setLocale(props.props.language.substring(0, 2));

        this.state = {
            language: counterpart.getLocale(),
            docs: props.props.isUnitedStates ? docsList : [],
            collateralDocs: collateralDocsList,
            mobileApps: mobileAppsList,
            isUnitedStates: props.props.isUnitedStates || false
        }

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(metric) {
        if (metric) {
            this.props.props.kissMetricInfo.getKissMetricInfo().then((info) => {
                this.props.props.segmentio.track(metric, info);
            });
        }
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    { this.state.language === 'en' ? <ResourceVideos handleClick={this.handleClick} /> : null }
                    <ResourceDocs docs={this.state.docs} collateralDocs={this.state.collateralDocs} handleClick={this.handleClick} />
                    <MobileApps apps={this.state.mobileApps} handleClick={this.handleClick} />
                </div>
            </div>
        );
    }
}

Resources.propTypes = {
    props: PropTypes.object,
}

export default Resources;
