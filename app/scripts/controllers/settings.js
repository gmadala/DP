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
      },
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
        if (!this.validate()) {
          return false;
        }
        if (!this.isDirty()) {
          this.cancel();
          return false;
        }
        return true;
      },
      saveSuccess: function() {
        this.dirtyData = this.validation = null;
        this.editable = false;
        this.showError = false;
      },
      saveError: function(error) {
        console.log(error.text);
        this.showError = true;
        this.errorMsg = error.text;
      }
    };

    Settings.get().then(function(results) {
        $scope.loading = true;

        /** PROFILE **/
        $scope.profile = {
          data: {
            username: results.Username,
            email: results.Email,
            phone: results.CellPhone,
            questions: results.SecurityQuestions,
            allQuestions: results.AllSecurityQuestions
          },
          dirtyData: null, // a copy of the data for editing (lazily built)
          editable: false,
          edit: function() { prv.edit.apply(this); },
          cancel: function() { prv.cancel.apply(this); },
          save: function() {
            if (prv.save.apply(this)) {
              var d = this.data = this.dirtyData,
                cleanPhone = d.phone.replace($scope.phonePattern, '$2$4$5$6$7'); // sanitize phone format

              this.updateQuestionText(d.questions);

              Settings.saveProfile(d.username, d.password, d.email, cleanPhone, d.questions).then(
                prv.saveSuccess.bind(this),
                prv.saveError.bind(this)
              );
            }
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

        /** BUSINESS SETTINGS **/
        $scope.business = {
          data: {
            email: results.BusinessEmail,
            enhancedRegistrationEnabled: results.EnhancedRegistrationEnabled,
            enhancedRegistrationPin: null
          },
          dirtyData: null, // a copy of the data for editing (lazily built)
          editable: false,
          edit: function() { prv.edit.apply(this); },
          cancel: function() { prv.cancel.apply(this); },
          save: function() {
            if (prv.save.apply(this)) {
              var d = this.data = this.dirtyData;

              Settings.saveBusiness(d.email, d.enhancedRegistrationEnabled, d.enhancedRegistrationPin).then(
                prv.saveSuccess.bind(this),
                prv.saveError.bind(this)
              );
            }
          },
          isDirty: function() {
            return $scope.busSettings.$dirty;
          },
          validate: function() {
            var business = $scope.business;
            business.validation = angular.copy($scope.busSettings);
            return business.validation.$valid;
          },
          confirmDisableEnhanced: function() {
            var dialogOptions = {
              backdrop: true,
              keyboard: true,
              backdropClick: true,
              templateUrl: 'views/modals/confirmDisableEnhanced.html',
              controller: 'ConfirmDisableCtrl',
            };
            $dialog.dialog(dialogOptions).open().then(function(result) {
              if (result) {
                $scope.business.dirtyData.enhancedRegistrationPin = null;
                $scope.business.dirtyData.enhancedRegistrationEnabled = false;
              } else {
                $scope.business.dirtyData.enhancedRegistrationEnabled = true;
              }
            });
          }
        };
        $scope.$watch('business.dirtyData.enhancedRegistrationEnabled', function(enabled) {
          if ($scope.business.dirtyData && !enabled) {
            $scope.business.confirmDisableEnhanced();
          }
        });

        /** TITLE SETTINGS **/
        $scope.title = {
          data: {
            longFormatAddressText: results,
            titleAddress: results.CurrentTitleReleaseAddress,
            addresses: results.Addresses
          },
          dirtyData: null, // a copy of the data for editing (lazily built)
          editable: false,
          edit: function() {
            prv.edit.apply(this);
            this.updateAddressSelection();
          },
          cancel: function() { prv.cancel.apply(this); },
          save: function() {
            if (prv.save.apply(this)) {
              this.updateAddressSelection();
              var d = this.data = this.dirtyData;

              Settings.saveTitleAddress(d.titleAddress.BusinessAddressId).then(
                prv.saveSuccess.bind(this),
                prv.saveError.bind(this)
              );
            }
          },
          isDirty: function() {
            return $scope.titleSettings.$dirty;
          },
          validate: function() {
            var title = $scope.title;
            title.validation = angular.copy($scope.titleSettings);
            return title.validation.$valid;
          },
          updateAddressSelection: function() {
            var selectedId = this.dirtyData.titleAddress.BusinessAddressId;
            for (var i = 0; i < this.dirtyData.addresses.length; i++) {
              if (selectedId === this.dirtyData.addresses[i].BusinessAddressId) {
                this.dirtyData.titleAddress = this.data.addresses[i];
              }
            }
          },
          toShortAddress: function(address) {
            return address ? address.Line1 + (address.Line2 ? ' ' + address.Line2 : '') + ' / ' + address.City + ' ' + address.State : '';
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
  })

  .controller('ConfirmDisableCtrl', function($scope, dialog) {
    $scope.close = function(result) {
      dialog.close(result);
    };
  });
