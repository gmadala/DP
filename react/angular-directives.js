import Date from './app/shared/Date'
import ResourcesContainer from './app/resources/ResourcesContainer'
import AuctionResourcesContainer from './app/resources/AuctionResourcesContainer'
import ProgressivePrompt from './app/progressivePrompt/ProgressivePrompt'
import Ribbon from './app/dashboard/Ribbon'
import SideMenuContainer from './app/sideMenu/SideMenuContainer'
import store from './store'

angular.module( 'nextgearWebApp' ).directive('dateComponent', reactDirective => reactDirective( Date ));
angular.module( 'nextgearWebApp' ).directive('resourcesComponent', ( reactDirective, User, gettextCatalog, api, kissMetricInfo, segmentio ) => reactDirective(ResourcesContainer, null, {}, {
    store,
    isUnitedStates: User.isUnitedStates( ),
    language: gettextCatalog.currentLanguage.substring( 0, 2 ),
    api,
    kissMetricInfo,
    segmentio
}));
angular.module( 'nextgearWebApp' ).directive('auctionResourcesComponent', ( reactDirective, User, gettextCatalog, kissMetricInfo, segmentio ) => reactDirective(AuctionResourcesContainer, null, {}, {
    store,
    isUnitedStates: User.isUnitedStates( ),
    language: gettextCatalog.currentLanguage.substring( 0, 2 ),
    kissMetricInfo,
    segmentio
}));
angular.module( 'nextgearWebApp' ).directive('progressivePromptComponent', reactDirective => reactDirective( ProgressivePrompt ));
angular.module( 'nextgearWebApp' ).directive('ribbonComponent', reactDirective => reactDirective( Ribbon ));
angular.module( 'nextgearWebApp' ).directive('sideMenuComponent', ( reactDirective, User, gettextCatalog, kissMetricInfo, segmentio, $state, $rootScope, nxgConfig ) =>
reactDirective( SideMenuContainer, ['isopen', 'togglemenu', 'support'], {}, {
    store,
    isUnitedStates: User.isUnitedStates( ),
    language: gettextCatalog.currentLanguage.substring( 0, 2 ),
    kissMetricInfo,
    segmentio,
    $state,
    User,
    $rootScope,
    nxgConfig
}))
