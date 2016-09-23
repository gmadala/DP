import Date from './shared/Date'
import Resources from './resources/Resources';
import AuctionResources from './resources/AuctionResources';

angular.module('nextgearWebApp').directive('dateComponent', (reactDirective) => reactDirective(Date));
angular.module('nextgearWebApp').directive('resourcesComponent', (reactDirective) => reactDirective(Resources));
angular.module('nextgearWebApp').directive('auctionResourcesComponent', (reactDirective) => reactDirective(AuctionResources));
