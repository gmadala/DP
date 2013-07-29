'use strict';

angular.module('nextgearWebApp')
  .directive('nxgInput', function () {
    return {
      template: '<div><div ng-hide="editable"> {{ model }}</div><div ng-show="editable"><div ng-transclude></div></div></div>',
      restrict: 'A',
      replace: true,
      transclude: true,
      scope: {
        model: '=',
        editable: '='
      }
      // link: function postLink(scope, element, attrs) {}
    };
  });
