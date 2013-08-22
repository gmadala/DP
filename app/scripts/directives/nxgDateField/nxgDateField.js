'use strict';

angular.module('nextgearWebApp')
  .directive('nxgDateField', function () {
    return {
      templateUrl: 'scripts/directives/nxgDateField/nxgDateField.html',
      replace: true,
      restrict: 'A',
      compile: function (element, attrs) {
        // move the id and ng-model down onto the enclosed input
        element.removeAttr('id').removeAttr('ng-model');
        element.find('input').attr('id', attrs.id).attr('ng-model', attrs.ngModel);
      }
    };
  });
