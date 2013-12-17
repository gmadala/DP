'use strict';

angular.module('nextgearWebApp')
  .directive('userVoice', function() {
    return {
      restrict: 'A',
      templateUrl: 'scripts/directives/nxgUserVoice/nxgUserVoice.html',
      controller: 'UserVoiceCtrl'
    };
  })

  .controller('UserVoiceCtrl', function($rootScope, $scope) {
    var UserVoice = window.UserVoice || [];

    $scope.showClassicWidget = function() {
      UserVoice.push(['showLightbox', 'classic_widget', {
        'mode': 'full',
        'primary_color': '#cc6d00',
        'link_color': '#007dbf',
        'default_mode': 'support',
        'forum_id': 233296,
        'support_tab_name': 'Technical Support'
      }]);
    };

  });
