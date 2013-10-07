'use strict';

angular.module('nextgearWebApp')
  .controller('SettingsCtrl', function($scope, $dialog, Settings) {
    $scope.loading = false;

    Settings.get().then(function(results) {
        $scope.loading = true;
        $scope.profile = {
          data: {
            username: results.Username,
            email: results.BusinessEmail,
            phone: results.CellPhone,
            questions: results.SecurityQuestions,
            allQuestions: results.AllSecurityQuestions
          },
          dirtyData: null, // a copy of the data for editing (lazily built)
          editable: false,
          edit: function() {
            this.dirtyData = angular.copy(this.data);
            this.editable = true;
          },
          cancel: function() {
            this.dirtyData = null;
            this.editable = false;
          },
          save: function() {
            var d = this.data = this.dirtyData;
            this.dirtyData = null;
            Settings.saveProfile(d.username, null /*TODO: Hook up password*/, d.email, d.phone, d.questions);
          }
        };
      },
      function(/*reason*/) {
        $scope.loading = false;
      });

    $scope.formatPhonenumber = function(item) {
      if (typeof item === 'string' && item.length === 10) {
        return '(' + item.substr(0, 3) + ') ' + item.substr(3, 3) + '-' + item.substr(6, 4);
      }
      else if (item) {
        return item.toString();
      }
      else {
        return '';
      }
    };
    //////////////////////////////////

    $scope.cancel = function() {
      $scope.editable = false;
    };

    $scope.save = function() {
      // TODO: update model with new data
      $scope.editable = false;
    };

    $scope.business = {
      email: 'dealername@company.com',
      enhanced: true,
      pin: ''
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

      $dialog.dialog(dialogOptions).open().then(function(result) {
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

  })

  .controller('ConfirmDisableCtrl', function($scope, dialog) {
    $scope.close = function(result) {
      dialog.close(result);
    };
  });
