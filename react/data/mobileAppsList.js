import React from 'react';
import Translate from 'react-translate-component';
import metric from './metricList';

export default [
    {
        id: 1,
        name: <Translate content="resources.mobileAppsList.mobileIos"/>,
        url: 'https://customer.nextgearcapital.com/documents/my_nextgear_ios_steps_v3.pdf',
        metric: metric.DEALER_RESOURCES_IOS_APP,
    }, {
        id: 2,
        name: <Translate content="resources.mobileAppsList.mobileAndroid"/>,
        url: 'https://customer.nextgearcapital.com/documents/my_nextgear_android_steps_v3.pdf',
        metric: metric.DEALER_RESOURCES_ANDROID_APP,
    },
]
