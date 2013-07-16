'use strict';

angular.module('nextgearWebApp')
  .controller('SettingsCtrl', function ($scope) {
    console.log('in settings');
    $scope.username = "test user";
    $scope.password = "test pword";
    $scope.secQuestion = "Where were you born?";
    $scope.email = "dealername@company.com";
    $scope.phone = "(555) 555-5555";

    $scope.busEmail = "dealername@company.com";
    $scope.enhanced = true;

    $scope.street = "1234 Main Street";
    $scope.city = "Anytown";
    $scope.state = "MI";
    $scope.zip = "12345";

    $scope.notification = {
      title: "Weekly Upcoming Payments Report",
      type: "email",
      on: true
    };
  });
