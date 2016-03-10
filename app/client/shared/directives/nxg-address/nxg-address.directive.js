(function () {
  'use strict';

  angular
    .module('nextgearWebApp')
    .directive('nxgAddress', address);

  address.$inject = ['User'];

  /**
   * Directive for rendering addresses - currently used in financial accounts in account management
   */
  function address(User) {

    var directive;
    directive = {
      link: link,
      templateUrl: 'client/shared/directives/nxg-address/nxg-address.html',
      scope: {
        city: '=',
        info: '=',
        line1: '=',
        line2: '=',
        state: '=',
        validity: '=',
        zip: '='
      },
      restrict: 'E'
    };

    return directive;

    function link(scope) {
      scope.line1Regex = /^\d{1,5}(\s\w*){1,2}\s.*$/;
      scope.zipRegex = /^\d{5}(-\d{4})?$/;
      scope.cityRegex = /^[A-Za-z.'\s-]*$/;

      // Level of indirection and wrapper for two-way binding in child scope
      scope.inputs = {};

      // Get list of states
      User.getStatics().then(function(statics) {
        scope.states = statics.states;
      });

      scope.$watch('inputs.state', function(newVal, oldVal) {
        if(newVal !== oldVal) {
          scope.info.State = scope.inputs.state.StateId;
        }
      });

      /* When address ID is required, make sure to implement a
       * conversion between addresses inputted as a string
       * and Address ID */
    }

  }
})();
