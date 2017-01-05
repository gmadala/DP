import Date from './app/shared/Date'
import Resources from './app/resources/Resources';
import AuctionResources from './app/resources/AuctionResources';
import Ribbon from './app/dashboard/Ribbon';
import store from './store';

angular.module( 'nextgearWebApp' ).directive('dateComponent', reactDirective => reactDirective( Date ));
angular.module( 'nextgearWebApp' ).directive('resourcesComponent', reactDirective => reactDirective( Resources, null, {}, { store } ));
angular.module( 'nextgearWebApp' ).directive('auctionResourcesComponent', reactDirective => reactDirective( AuctionResources ));
angular.module( 'nextgearWebApp' ).directive('ribbonComponent', reactDirective => reactDirective( Ribbon ));
