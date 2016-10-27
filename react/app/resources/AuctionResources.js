import React, {Component, PropTypes} from 'react';
import counterpart from 'counterpart';
import ResourceDocs from './ResourceDocs';
import auctionDocsList from './data/_auctionDocsList';
import metric from '../shared/metric';

class AuctionResources extends Component {
  constructor(props) {
    super(props);

    // set current language
    counterpart.setLocale(props.props.language.substring(0, 2));

    this.state = {
      language: counterpart.getLocale(),
      docs: props.props.isUnitedStates ? auctionDocsList : [],
      isUnitedStates: props.props.isUnitedStates || false
    }

    // log current page view
    this.handleClick(metric.VIEW_RESOURCES_PAGE);
  }

  handleClick = ({metricKey}) => {
    if (metricKey) {
      this.props.props.kissMetricInfo.getKissMetricInfo().then((info) => {
        this.props.props.segmentio.track(metricKey, info);
      });
    }
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <ResourceDocs docs={this.state.docs} handleClick={this.handleClick} />
          </div>
        </div>
      </div>
    );
  }
}

AuctionResources.propTypes = {
  props: PropTypes.object.isRequired
}

export default AuctionResources;
