'use strict';

angular.module('nextgearWebApp')
  .controller('NameSearchCtrl', function ($scope, dialog) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.close = function() {
      dialog.close();
    };
  });

'use strict';
