'use strict';

angular.module('nextgearWebApp')
  .directive('userVoice', function() {
    return {
      restrict: 'A',
      templateUrl: 'scripts/directives/nxgUserVoice/nxgUserVoice.html',
      controller: 'UserVoiceCtrl'
    };
  })

  .controller('UserVoiceCtrl', function($rootScope, $scope, User, nxgConfig, UserVoice) {
    $scope.showClassicWidget = function() {
      var uv = UserVoice.getAPI(),
        isDealer = User.isDealer(),
        config = nxgConfig.userVoice,
        // check user type, dealers and auctions will have different subdomains to go to
        forumId = isDealer ? config.dealerForumId : config.auctionForumId,
        customTemplateId = isDealer ? config.dealerCustomTemplateId : config.auctionCustomTemplateId;

      uv.push(['showLightbox', 'classic_widget', {
        'mode': 'full',
        'primary_color': '#135889', // $brand
        'link_color': '#1864A1', // $brand-text
        'default_mode': 'support',
        'forum_id': forumId,
        'custom_template_id': customTemplateId, // custom stylesheet editable on <subdomain>.uservoice.com/admin
        'support_tab_name': 'Technical Support'
      }]);
    };
  });
