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
        this.data = this.dirtyData;
        this.dirtyData = this.validation = null;
        this.editable = false;
        this.showError = false;
      },
      saveError: function(error) {
        this.showError = true;
        this.errorMsg = error.text;
      },
      /**
       * We get a notification object for every notification/delivery_method combination. This function
       * bundles them up so we get a notification that has a list of delivery methods.
       */
      bundleNotifications: function(notifications) {

        var hash = {},
          bundled = [];

        angular.forEach(notifications, function(n) {
          var deliveryMethod = {
            DeliveryMethodId: n.DeliveryMethodId,
            DeliveryMethodName: n.DeliveryMethodName
          };

          if (hash[n.NotificationId]) {
            hash[n.NotificationId].DeliveryMethods.push(deliveryMethod);
          }
          else {
            bundled.push(
              hash[n.NotificationId] = {
                NotificationId: n.NotificationId,
                NotificationName: n.NotificationName,
                DeliveryMethods: [deliveryMethod]
              }
            );
          }
        });
        return bundled;
      },
      /**
       * This does the opposite of bundleNotifications. It flattens bundled notification
       * objects to be consumed by the model.
       */
      flattenNotifications: function(notifications) {
        var flatList = [];
        angular.forEach(notifications, function(n) {
          angular.forEach(n.DeliveryMethods, function(d) {
            flatList.push({
              NotificationId: n.NotificationId,
              DeliveryMethodId: d.DeliveryMethodId,
              Enabled: !!d.Enabled
            });
          });
        });
        return flatList;
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
          edit: function() {
            prv.edit.apply(this);
          },
          cancel: function() {
            prv.cancel.apply(this);
          },
          save: function() {
            if (prv.save.apply(this)) {
              var d = this.dirtyData,
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

            if (profile.dirtyData.password && profile.dirtyData.passwordConfirm) {
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
          edit: function() {
            prv.edit.apply(this);
          },
          cancel: function() {
            prv.cancel.apply(this);
          },
          save: function() {
            if (prv.save.apply(this)) {
              var d = this.dirtyData;

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
          cancel: function() {
            prv.cancel.apply(this);
          },
          save: function() {
            if (prv.save.apply(this)) {
              this.updateAddressSelection();
              var d = this.dirtyData;

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

        /** NOTIFICATIONS **/
        $scope.notifications = {
          data: {
            selected: prv.bundleNotifications(results.Notifications),
            available: results.AvailableNotifications
          },
          dirtyData: null, // a copy of the data for editing (lazily built)
          editable: false,
          edit: function() {
            prv.edit.apply(this);
            this.updateAvailableNotification(this.dirtyData);
          },
          cancel: function() {
            prv.cancel.apply(this);
          },
          save: function() {
            if (prv.save.apply(this)) {
              this.updateSelectedNotifications(this.dirtyData);
              Settings.saveNotifications(prv.flattenNotifications(this.dirtyData.available)).then(
                prv.saveSuccess.bind(this),
                prv.saveError.bind(this)
              );
            }
          },
          isDirty: function() {
            return $scope.notificationSettings.$dirty;
          },
          validate: function() {
            return true;
            /*nothing can be invalid input*/
          },
          updateSelectedNotifications: function(data) {
            if (data && data.available && data.selected) {
              var selectedNotifications = [];
              angular.forEach(data.available, function(notification) {
                var selectedMethods = [];
                angular.forEach(notification.DeliveryMethods, function(method) {
                  if (method.Enabled) {
                    selectedMethods.push({
                      DeliveryMethodId: method.DeliveryMethodId,
                      DeliveryMethodName: method.Name
                    });
                  }
                });
                if (selectedMethods.length > 0) {
                  selectedNotifications.push({
                    NotificationId: notification.NotificationId,
                    NotificationName: notification.Name,
                    DeliveryMethods: selectedMethods
                  });
                }
              });
              data.selected = selectedNotifications;
            }
          },
          updateAvailableNotification: function(data) {
            var selectionHash = {};
            // to avoid a performance hit of O(n^4) we extract a hash of all the selected notifications/methods
            angular.forEach(data.selected, function(selectedNotification) {
              angular.forEach(selectedNotification.DeliveryMethods, function(selectedMethod) {
                selectionHash[selectedNotification.NotificationId + '-' + selectedMethod.DeliveryMethodId] = true;
              });
            });

            if (data && data.available && data.selected) {
              angular.forEach(data.available, function(notification) {
                angular.forEach(notification.DeliveryMethods, function(method) {
                  method.Enabled = selectionHash[notification.NotificationId + '-' + method.DeliveryMethodId];
                });
              });
            }
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
  })

  .
  controller('ConfirmDisableCtrl', function($scope, dialog) {
    $scope.close = function(result) {
      dialog.close(result);
    };
  });
