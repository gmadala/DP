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
  .controller('BusinessCtrl', function($scope, $dialog) {
    $scope.business = {
      email: 'dealername@company.com',
      enhanced: true,
      pin: '',
    };

    $scope.editable = false;

    $scope.confirmDisableEnhanced = function() {
      var dialogOptions = {
        backdrop: true,
        keyboard: true,
        backdropClick: true,
        templateUrl: 'views/modals/confirmDisableEnhanced.html',
        controller: 'ConfirmDisableCtrl',
      };

      $dialog.dialog(dialogOptions).open();
    }

    $scope.$watch('business.enhanced', function(newVal) {
      if (newVal == false) {
        $scope.confirmDisableEnhanced();
      }
    });

    $scope.save = function() {
      // TODO: update model with new data
      $scope.editable = false;
    };


  })
  .controller('ConfirmDisableCtrl', function($scope, dialog) {
    $scope.disableEnhanced = function() {
      // TODO: Clear pin #
      // TODO: Update business.enhanced to be false
      dialog.close();
    }

    $scope.noThanks = function() {
      // TODO: set business.enhanced back to true
      dialog.close();
    }
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
