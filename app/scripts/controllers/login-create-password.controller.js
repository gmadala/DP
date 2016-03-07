'use strict';

angular.module('nextgearWebApp')
  .controller('LoginCreatePasswordCtrl', function($rootScope, $scope, User) {

    var prv = {
      passwordPattern: {
        digits: /(?=.*\d)/,
        lowercase: /(?=.*[a-z])/,
        uppercase: /(?=.*[A-Z])/,
        special: /(?=.*[!@#$%\^\&\*\(\)\-_\+={}\[\]\\\|;:'"<>,.\?\/`~])/
      },
      validatePasswordPattern: function(pwd) {
        var groupCount = 0;
        if (this.passwordPattern.digits.test(pwd)) {
          groupCount++;
        }
        if (this.passwordPattern.lowercase.test(pwd)) {
          groupCount++;
        }
        if (this.passwordPattern.uppercase.test(pwd)) {
          groupCount++;
        }
        if (this.passwordPattern.special.test(pwd)) {
          groupCount++;
        }
        return groupCount >= 3 && pwd.length >= 8;
      },
      validate: function() {
        var validation = $scope.validation = angular.copy($scope.createPasswordForm),
          pwd = $scope.pwd.newPassword,
          pwdConfirm = $scope.pwd.passwordConfirmation;

        if (pwd || pwdConfirm) {
          // check matching passwords
          if (pwd!== pwdConfirm) {
            validation.$error.nomatch = validation.$invalid = true;
          }
          // check valid password pattern
          else if (!prv.validatePasswordPattern(pwd)) {
            validation.$error.pattern = validation.$invalid = true;
          }
        }
        return !validation.$invalid;
      }
    };

    $scope.createPassword = function() {
      if (prv.validate()) {
        $scope.busy = true;
        User.changePassword($scope.pwd.newPassword).then(
          // success
          function() {
            $scope.busy = false;
            User.clearPasswordChangeRequired();
            $rootScope.$broadcast('event:temporaryPasswordChanged');
          },
          // failure
          function() {
            $scope.busy = false;
          }
        );
      }
    };

    $scope.cancel = function() {
      $rootScope.$emit('event:userRequestedLogout');
    };

  });
