import Date from './app/shared/Date'
import ResourcesContainer from './app/resources/ResourcesContainer';
import AuctionResources from './app/resources/AuctionResources';
import Ribbon from './app/dashboard/Ribbon';
import store from './store';

angular.module( 'nextgearWebApp' ).directive('dateComponent', reactDirective => reactDirective( Date ));
angular.module( 'nextgearWebApp' ).directive('resourcesComponent', ( reactDirective, User, gettextCatalog, api ) => reactDirective(ResourcesContainer, null, {}, {
    store,
    isUnitedStates: User.isUnitedStates( ),
    language: gettextCatalog.currentLanguage.substring( 0, 2 ),
    api
}));
angular.module( 'nextgearWebApp' ).directive('auctionResourcesComponent', ( reactDirective, User, gettextCatalog ) => reactDirective(AuctionResources, null, {}, {
    store,
    isUnitedStates: User.isUnitedStates( ),
    language: gettextCatalog.currentLanguage.substring( 0, 2 ),
}));
angular.module( 'nextgearWebApp' ).directive('ribbonComponent', reactDirective => reactDirective( Ribbon ));
