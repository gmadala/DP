import React from 'react';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';
import metric from '../../shared/metric';

let languagePrefix = counterpart.getLocale();

if (languagePrefix.indexOf('_CA') !== -1) {
  languagePrefix = 'CAE%20';
}

module.exports = [
  {
    id: 0,
    name: <Translate content="resources.auctionDocsList.sellerGuide" />,
    metric: metric.AUCTION_RESOURCES_INSTRUCTIONS_FOR_SELLERS_PAGE,
    url: `documents/${languagePrefix}NextGear%20Capital%20Website%20Guide%20-%20Sellers.pdf`
  }
]
