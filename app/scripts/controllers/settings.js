'use strict';

angular.module('nextgearWebApp')
  .controller('SettingsCtrl', function($scope, $dialog, Settings) {
    $scope.loading = false;

    // Valid pattern examples: 5552301520, (555)230-1520, 555-230-1520, 1-555-230-1520
    $scope.phonePattern = /^((\d)-?)?(\((\d{3})\)|(\d{3})-?)(\d{3})-?(\d{4})$/;
    $scope.cleanPhoneReplacementPattern = '$2$4$5$6$7'; // this matches all the digit groups in the phonePattern regex

    // Password must be at least 8 characters long and contain 3 of the following 4 groups: uppercase, lowercase, number, special characters
    var prv = {
      passwordPattern: {
        digits: /(?=.*\d)/,
        lowercase: /(?=.*[a-z])/,
        uppercase: /(?=.*[A-Z])/,
        special: /(?=.*[!@#$%\^\&\*\(\)\-_\+={}\[\]\\\|;:'"<>,.\?\/`~])/
      }
    };

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
            this.showError = false;
          },
          cancel: function() {
            this.dirtyData = this.validation = null;
            this.editable = false;
          },
          save: function() {
            if (!this.isDirty()) {
              this.cancel();
              return false;
            }
            if (!this.validate()) {
              return false;
            }
            var d = this.data = this.dirtyData,
              cleanPhone = d.phone.replace($scope.phonePattern, '$2$4$5$6$7'); // sanitize phone format

            this.updateQuestionText(d.questions);

            Settings.saveProfile(d.username, d.password, d.email, cleanPhone, d.questions).then(
              function(/*success*/) {
                this.dirtyData = this.validation = null;
                this.editable = false;
                this.showError = false;
              }.bind(this),
              function(error) {
                console.log(error.text);
                this.showError = true;
                this.errorMsg = error.text;
              }.bind(this)
            );
          },
          updateQuestionText: function(questions) {
            for (var i = 0; i < questions.length; i++) {
              var q = questions[i];
              q.QuestionText = this.getQuestionText(q.SecurityQuestionId);
            }
          },
          getQuestionText: function(id) {
            for (var i = 0; i < this.data.allQuestions.length; i++) {
              var q = this.data.allQuestions[i];
              if (id === q.QuestionId) {
                return q.QuestionText;
              }
            }
            return '';
          },
          isDirty: function() {
            return $scope.userSettings.$dirty;
          },
          validate: function() {
            var profile = $scope.profile;
            profile.validation = angular.copy($scope.userSettings);

            // check matching passwords
            if (profile.dirtyData.password !== profile.dirtyData.passwordConfirm) {
              profile.validation.setPassword.$error.nomatch = true;
              profile.validation.$valid = false;
            }
            // check valid password pattern
            else if (profile.validation.setPassword.$dirty && !this.validatePasswordPattern(profile.dirtyData.password)) {
              profile.validation.setPassword.$error.pattern = true;
              profile.validation.$valid = false;
            }
            // check all questions have answers
            for (var i = 0; i < profile.dirtyData.questions.length; i++) {
              var q = profile.dirtyData.questions[i];
              if (!q.Answer) {
                q.$error = { required: true };
                profile.validation.$valid = false;
              }
            }
            return profile.validation.$valid;
          },
          validatePasswordPattern: function(pwd) {
            var groupCount = 0;
            if (prv.passwordPattern.digits.test(pwd)) {
              groupCount++;
            }
            if (prv.passwordPattern.lowercase.test(pwd)) {
              groupCount++;
            }
            if (prv.passwordPattern.uppercase.test(pwd)) {
              groupCount++;
            }
            if (prv.passwordPattern.special.test(pwd)) {
              groupCount++;
            }
            return groupCount >= 3 && pwd.length >= 8;
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
