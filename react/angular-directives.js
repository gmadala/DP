import Date from './app/shared/Date'
import ResourcesContainer from './app/resources/ResourcesContainer';
import AuctionResourcesContainer from './app/resources/AuctionResourcesContainer';
import ProgressivePrompt from './app/progressivePrompt/ProgressivePrompt';
import Ribbon from './app/ribbon/Ribbon';
import AngularServicesContainer from './app/angularServices/AngularServicesContainer';

import store from './store';

angular.module( 'nextgearWebApp' ).directive('dateComponent', reactDirective => reactDirective( Date ));
angular.module( 'nextgearWebApp' ).directive('resourcesComponent', reactDirective => reactDirective(ResourcesContainer, null, {}, { store }));
angular.module( 'nextgearWebApp' ).directive('auctionResourcesComponent', reactDirective => reactDirective(AuctionResourcesContainer, null, {}, { store }));
angular.module( 'nextgearWebApp' ).directive('progressivePromptComponent', reactDirective => reactDirective( ProgressivePrompt ));
angular.module( 'nextgearWebApp' ).directive('ribbonComponent', reactDirective => reactDirective( Ribbon ));

angular.module( 'nextgearWebApp' ).directive('angularServicesComponent',
(
    reactDirective,
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
) => reactDirective(
    AngularServicesContainer, ['isloggedin'], {}, {
        store,
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
    }
))
