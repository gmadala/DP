/**
 * Created by gayathrimadala on 3/31/15.
 */
'use strict';

angular.module('nextgearWebApp')
  .directive('nxgPrivacyStatement', function (gettext) {

    var privacyStatement = gettext('Privacy Statement');
    return {
      restrict: 'E',
      replace: true,
      template: '<a href="{{href}}" target="_blank" nxg-track="{{metric.CLICK_PRIVACY_STATEMENT_LINK}}" translate>'
      + privacyStatement + '</a>',
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
  });

