import React, { PropTypes, Component } from 'react';
import counterpart from 'counterpart';

class AngularServices extends Component {
    componentDidMount() {
        this.props.setAngularObj(this.props.User, 'User');
        this.props.setAngularObj(this.props.gettextCatalog, 'GetText');
        this.props.setAngularObj(this.props.kissMetricInfo, 'KissMetric');
        this.props.setAngularObj(this.props.segmentio, 'SegmentIO');
        this.props.setAngularObj(this.props.api, 'Api');
        this.props.setAngularObj(this.props.language, 'Language');
        this.props.setAngularObj(this.props.$window, '$window');
        this.props.setAngularObj(false, 'isUnitedStates')
        this.props.setAngularObj(this.props.gettextCatalog.currentLanguage.substring(0, 2), 'CurrentLanguage')
        this.props.setAngularObj(this.props.nxgConfig, 'NxgConfig')
        this.props.setAngularObj(this.props.$rootScope, '$rootScope')
        this.props.setAngularObj(this.props.$state, '$state')
    }

    componentDidUpdate() {
        counterpart.setLocale(this.props.gettextCatalog.currentLanguage.substring(0, 2)); // set language

        this.props.User.refreshInfo().then(() => this.props.setAngularObj(this.props.User.isUnitedStates(), 'isUnitedStates'))
    }

    render() {
        return (
            <span/>
        );
    }
}

AngularServices.propTypes = {
    setAngularObj: PropTypes.func.isRequired,
    User: PropTypes.any.isRequired,
    gettextCatalog: PropTypes.any.isRequired,
    kissMetricInfo: PropTypes.any.isRequired,
    segmentio: PropTypes.any.isRequired,
    api: PropTypes.any.isRequired,
    language: PropTypes.any.isRequired,
    $window: PropTypes.any.isRequired,
    $state: PropTypes.any.isRequired,
    nxgConfig: PropTypes.any.isRequired,
    $rootScope: PropTypes.any.isRequired
}

export default AngularServices;
