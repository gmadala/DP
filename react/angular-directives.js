import Date from './app/shared/Date'
import ProgressivePrompt from './app/progressivePrompt/ProgressivePrompt';
import Resources from './app/resources/Resources';
import AuctionResources from './app/resources/AuctionResources';

angular.module( 'nextgearWebApp' ).directive('dateComponent', reactDirective => reactDirective( Date ));
angular.module( 'nextgearWebApp' ).directive('resourcesComponent', reactDirective => reactDirective( Resources ));
angular.module( 'nextgearWebApp' ).directive('auctionResourcesComponent', reactDirective => reactDirective( AuctionResources ));
angular.module( 'nextgearWebApp' ).directive('progressivePromptComponent', reactDirective => reactDirective( ProgressivePrompt ));
