(function() {
  'use strict';

  /**
   * Provides a way to make field validity contingent on external conditions by defining
   * an arbitrary scope expression that must evaluate to true for a field to be valid
   *
   * Notes:
   *
   * This is not intended to be a way to define custom validation for the actual
   * value of the field, since this value is not available to the expression
   * -- for that, see ui-validate here: http://angular-ui.github.io/ui-utils/
   *
   * Since this validates conditions independent of the ng-model value, the value
   * will be passed through even when this validator is invalid, since the value
   * itself may be fine (though other validators in the chain could still intercept
   * it and change it to undefined).
   */
  angular
    .module('nextgearWebApp')
    .directive('nxgRequires', nxgRequires);

  nxgRequires.$inject = [];

  function nxgRequires() {

    return {
      restrict: 'A',
      require: 'ngModel',
      link: function postLink(scope, element, attrs, ctrl) {
        scope.$watch(attrs.nxgRequires, function (newValue) {
          ctrl.$setValidity('nxgRequires', !!newValue);
        });

        var validator = function(value) {
          ctrl.$setValidity('nxgRequires', !!scope.$eval(attrs.nxgRequires));
          return value;
        };

        ctrl.$parsers.push(validator);
      }
    };

  }
})();
