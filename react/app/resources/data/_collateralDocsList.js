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
        id: 1,
        name: <Translate content="resources.collateralDocsList.welcomeLetter" />,
        url: `documents/${languagePrefix}Welcome%20Letter.pdf`,
        metric: metric.DEALER_RESOURCES_WELCOME_LETTER_PAGE
    },
    {
        id: 2,
        name: <Translate content="resources.collateralDocsList.guidelines" />,
        url: `documents/${languagePrefix}Insurance%20Guidelines.pdf`,
        metric: metric.DEALER_RESOURCES_GUIDELINES_PAGE
    },
    {
        id: 3,
        name: <Translate content="resources.collateralDocsList.informationSheet" />,
        url: `documents/${languagePrefix}Information%20Sheet.pdf`,
        metric: metric.DEALER_RESOURCES_INFORMATION_SHEET_PAGE
    },
    {
        id: 4,
        name: <Translate content="resources.collateralDocsList.claimForm" />,
        url: `documents/${languagePrefix}Claim%20Form.pdf`,
        metric: metric.DEALER_RESOURCES_CLAIM_FORM_PAGE
    }
]
