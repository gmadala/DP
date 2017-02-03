import React, { PropTypes } from 'react';
import counterpart from 'counterpart';

const AngularServices = ({
    setAngularObj,
    User,
    gettextCatalog,
    kissMetricInfo,
    segmentio,
    api,
    language,
    $window,
    nxgConfig,
    $rootScope,
    $state
}) => {
    setAngularObj(User, 'User');
    setAngularObj(gettextCatalog, 'GetText');
    setAngularObj(kissMetricInfo, 'KissMetric');
    setAngularObj(segmentio, 'SegmentIO');
    setAngularObj(api, 'Api');
    setAngularObj(language, 'Language');
    setAngularObj($window, '$window');
    setAngularObj(User.isUnitedStates(), 'IsUnitedStates')
    setAngularObj(gettextCatalog.currentLanguage, 'CurrentLanguage')
    setAngularObj(nxgConfig, 'NxgConfig')
    setAngularObj($rootScope, '$rootScope')
    setAngularObj($state, '$state')

    counterpart.setLocale(gettextCatalog.currentLanguage.substring(0, 2)); // set language

    return (
        <span/>
    );
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
