import React from 'react';
import Translate from 'react-translate-component';
import metric from '../../shared/metric';

module.exports = [
  {
    id: 1,
    name: <Translate content="resources.mobileAppsList.mobileIos" />,
    url: 'https://itunes.apple.com/us/app/nextgear-capital/id748609885?mt=8',
    metric: metric.DEALER_RESOURCES_IOS_APP
  }, {
    id: 2,
    name: <Translate content="resources.mobileAppsList.mobileAndroid" />,
    url: 'https://play.google.com/store/apps/details?id=com.nextgear.mobile',
    metric: metric.DEALER_RESOURCES_ANDROID_APP
  }
]
