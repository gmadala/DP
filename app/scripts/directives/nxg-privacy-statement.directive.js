(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .directive('nxgPrivacyStatement', nxgPrivacyStatement);

  nxgPrivacyStatement.$inject = ['gettext'];

  function nxgPrivacyStatement(gettext) {

    var privacyStatement = gettext('Privacy Statement');

    return {
      restrict: 'E',
      replace: true,
      template: '<a href="{{href}}" target="_blank" translate>' +
      privacyStatement + '</a>',
      controller: function ($scope, User) {
        $scope.$watch(
          function(){ return User.infoLoaded(); },
          function() {
            $scope.href = 'http://www.nextgearcapital.com/privacy-statement';
            $scope.isUnitedStates = User.isUnitedStates();
            if(!$scope.isUnitedStates && $scope.isUnitedStates !== null) {
              $scope.href = 'http://www.nextgearcapital.com/privacy-policy-canada';
            }
          });
      }
    };

  }
})();
