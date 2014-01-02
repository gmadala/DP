'use strict';

angular.module('nextgearWebApp')
  .directive('userVoice', function() {
    return {
      restrict: 'A',
      templateUrl: 'scripts/directives/nxgUserVoice/nxgUserVoice.html',
      controller: 'UserVoiceCtrl'
    };
  })

  .controller('UserVoiceCtrl', function($rootScope, $scope, User) {
    var UserVoice = window.UserVoice || [],
        isDealer = User.isDealer(),
        // check user type, dealers and auctions will have different subdomains to go to
        forumId = isDealer ? 233296 : 'xxxxxx',
        customTemplateId = isDealer ? 21815 : 'xxxxxxx';



    $scope.showClassicWidget = function() {
      UserVoice.push(['showLightbox', 'classic_widget', {
        'mode': 'full',
        'primary_color': '#135889', // $brand
        'link_color': '#1864A1', // $brand-text
        'default_mode': 'support',
        'forum_id': forumId,
        'custom_template_id': customTemplateId, // custom stylesheet editable on nextgearcapital.uservoice.com/admin
        'support_tab_name': 'Technical Support'
      }]);
    };
  });
