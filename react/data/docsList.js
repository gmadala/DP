import React from 'react';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';
import metric from './metricList';

let languagePrefix = counterpart.getLocale( );

if ( languagePrefix.indexOf( '_CA' ) !== -1 ) {
    languagePrefix = 'CAE%20';
} else {
    languagePrefix = '';
}

export default [
    {
        id: 0,
        name: <Translate content="resources.docsList.rates"/>,
        metric: metric.DEALER_RESOURCES_RATES_AND_FEES_PAGE,
        url: '',
    }, {
        id: 1,
        name: <Translate content="resources.docsList.welcomePacket"/>,
        url: 'http://www.nextgearcapital.com/welcome-packet/',
        metric: metric.DEALER_RESOURCES_WELCOME_PACKET_PAGE,
    }, {
        id: 2,
        name: <Translate content="resources.docsList.dealerChecklist"/>,
        url: `documents/${ languagePrefix }Dealer%20Funding%20Checklist.pdf`,
        metric: metric.DEALER_RESOURCES_DEALER_FUNDING_CHECKLIST_PAGE,
    }, {
        id: 3,
        name: <Translate content="resources.docsList.faq"/>,
        url: `documents/${ languagePrefix }Records%20Title%20FAQ.pdf`,
        metric: metric.DEALER_RESOURCES_TITLE_MANAGEMENT_FAQ,
    }, {
        id: 4,
        name: <Translate content="resources.docsList.instructions"/>,
        url: `documents/${ languagePrefix }NextGear%20Capital%20Website%20Guide%20-%20Buyers.pdf`,
        metric: metric.DEALER_RESOURCES_INSTRUCTIONS_FOR_BUYERS_PAGE,
    },
]
