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

    $scope.makeEditable = function() {
      $scope.editable = true;
    };

    $scope.cancel = function() {
      $scope.editable = false;
    };

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

      $dialog.dialog(dialogOptions).open().then(function(result){
        if (result) {
          // TODO: Change variables on server
          $scope.business.pin = '';
          $scope.business.enhanced = false;
        } else {
          $scope.business.enhanced = true;
        }
      });
    };

    $scope.$watch('business.enhanced', function(newVal) {
      if (newVal === false) {
        $scope.confirmDisableEnhanced();
      }
    });

    $scope.makeEditable = function() {
      $scope.editable = true;
    };

    $scope.cancel = function() {
      $scope.editable = false;
    };

    $scope.save = function() {
      // TODO: update model with new data
      $scope.editable = false;
    };
  })
  .controller('ConfirmDisableCtrl', function($scope, dialog) {
    $scope.close = function(result) {
      dialog.close(result);
    };
  })
  .controller('TitleCtrl', function($scope) {
    $scope.title = {
      address: '1234 Main St, Denver, CO',
    };

    $scope.editable = false;

    $scope.makeEditable = function() {
      $scope.editable = true;
    };

    $scope.cancel = function() {
      $scope.editable = false;
    };

    $scope.save = function() {
      // TODO: update model with new data
      $scope.editable = false;
    };
  })
  .controller('NotificationCtrl', function($scope) {
    $scope.notifications = [
      {
        'title': 'Weekly Upcoming Payments Report',
        'types': [
          {
            type: 'email',
            on: true
          },
          {
            type: 'text',
            on: false
          }
        ]
      },

      {
        'title': 'Another Notification',
        'types': [
          {
            type: 'text',
            on: true
          },
          {
            type: 'phone call',
            on: true
          }
        ]
      }
    ];

    $scope.editable = false;

    $scope.makeEditable = function() {
      $scope.editable = true;
    };

    $scope.cancel = function() {
      $scope.editable = false;
    };

    $scope.save = function() {
      // TODO: update model with new data
      $scope.editable = false;
    };

  });
