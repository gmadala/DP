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
        'primary_color': '#135889', // $brand
        'link_color': '#1864A1', // $brand-text
        'default_mode': 'support',
        'forum_id': 233296,
        'custom_template_id': 21815, // custom stylesheet editable on nextgearcapital.uservoice.com/admin
        'support_tab_name': 'Technical Support'
      }]);
    };
  });
