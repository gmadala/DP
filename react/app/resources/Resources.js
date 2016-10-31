import React, {Component, PropTypes} from 'react';
import counterpart from 'counterpart';
import ResourceVideos from './ResourceVideos';
import ResourceDocs from './ResourceDocs';
import MobileApps from './MobileApps';
import collateralDocsList from './data/_collateralDocsList';
import mobileAppsList from './data/_mobileAppsList';
import docsList from './data/_docsList';
import metric from '../shared/metric';

class Resources extends Component {
  constructor(props) {
    super(props);

    const rp = props.rp;

    // get fee schedule content link
    docsList[0].url = rp.api.contentLink('/dealer/feeschedule/FeeSchedule', {});

    // set current language
    counterpart.setLocale(rp.language.substring(0, 2));

    this.state = {
      language: counterpart.getLocale(),
      docs: rp.isUnitedStates ? docsList : [],
      collateralDocs: collateralDocsList,
      mobileApps: mobileAppsList,
      isUnitedStates: rp.isUnitedStates || false
    }

    // log current page view
    this.handleClick(metric.VIEW_RESOURCES_PAGE);
  }

  handleClick = (metricKey) => {
    if (metricKey) {
      this.props.rp.kissMetricInfo.getKissMetricInfo().then((info) => {
        this.props.rp.segmentio.track(metricKey, info);
      });
    }
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          {this.state.language === 'en' ? <ResourceVideos handleClick={this.handleClick} /> : null}
          <ResourceDocs docs={this.state.docs} collateralDocs={this.state.collateralDocs} handleClick={this.handleClick} />
          <MobileApps apps={this.state.mobileApps} handleClick={this.handleClick} />
        </div>
      </div>
    );
  }
}

Resources.propTypes = {
  rp: PropTypes.object
}

export default Resources;
