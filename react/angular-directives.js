import Date from './app/shared/Date'
import ResourcesContainer from './app/resources/ResourcesContainer';
import AuctionResourcesContainer from './app/resources/AuctionResourcesContainer';
import ProgressivePrompt from './app/progressivePrompt/ProgressivePrompt';
import Ribbon from './app/dashboard/Ribbon';
import store from './store';

angular.module( 'nextgearWebApp' ).directive('dateComponent', reactDirective => reactDirective( Date ));
angular.module( 'nextgearWebApp' ).directive('resourcesComponent', ( reactDirective, User, gettextCatalog, api ) =>
reactDirective(ResourcesContainer, null, {}, {
    store,
    isUnitedStates: User.isUnitedStates( ),
    language: gettextCatalog.currentLanguage.substring( 0, 2 ),
    api
}));
angular.module( 'nextgearWebApp' ).directive('auctionResourcesComponent', ( reactDirective, User, gettextCatalog ) => reactDirective(AuctionResourcesContainer, null, {}, {
    store,
    isUnitedStates: User.isUnitedStates( ),
    language: gettextCatalog.currentLanguage.substring( 0, 2 ),
}));
angular.module( 'nextgearWebApp' ).directive('progressivePromptComponent', reactDirective => reactDirective( ProgressivePrompt ));
angular.module( 'nextgearWebApp' ).directive('ribbonComponent', reactDirective => reactDirective( Ribbon ));
