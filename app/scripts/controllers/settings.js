'use strict';

angular.module('nextgearWebApp')
  .controller('SettingsCtrl', function() {})
  .controller('ProfileCtrl', function($scope) {
    $scope.profile = {
      username: 'test user',
      password: 'test pword',
      secQuestion: 'Where were you born?',
      email: 'dealername@company.com',
      phone: '(555) 555-5555'
    };

    $scope.editable = false;

    $scope.save = function() {
      // TODO: update model with new data
      $scope.editable = false;
    };
  })
  .controller('BusinessCtrl', function($scope) {
    $scope.business = {
      email: 'dealername@company.com',
      enhanced: true,
      pin: '',
    };

    $scope.editable = false;

    $scope.save = function() {
      // TODO: update model with new data
      $scope.editable = false;
    };
  })
  .controller('TitleCtrl', function($scope) {
    $scope.title = {
      address: '1234 Main St, Denver, CO',
    };

    $scope.editable = false;

    $scope.save = function() {
      // TODO: update model with new data
      $scope.editable = false;
    };
  })
  .controller('NotificationCtrl', function($scope) {
    $scope.notification = {
      title: 'Weekly Upcoming Payments Report',
      type: 'email',
      on: true
    };
  });
