'use strict';

angular.module('nextgearWebApp')
  .controller('LoginRecoverCtrl', function ($scope, $state, $dialog, User, gettextCatalog) {

    $scope.userNameRecovery = {
      // forgotUserNameForm
      email: null,
      failed: false,
      submit: function () {
        $scope.userNameRecovery.failed = false;

        $scope.forgotUserNameValidity = angular.copy($scope.forgotUserNameForm);
        if ($scope.forgotUserNameForm.$invalid) {
          return;
        }

        $scope.submitInProgress = true;
        User.recoverUserName($scope.userNameRecovery.email).then(
          function (/*success*/) {
            $scope.submitInProgress = false;
            $scope.showSuccessMessage();
          }, function (error) {
            error.dismiss();
            $scope.submitInProgress = false;
            $scope.userNameRecovery.failed = true;
          }
        );
      }
    };

    $scope.passwordRecovery = {
      // forgotPasswordForm
      username: null,
      usernameFailed: false,
      submitUsername: function () {
        $scope.passwordRecovery.usernameFailed = false;

        $scope.forgotPasswordValidity = angular.copy($scope.forgotPasswordForm);
        if ($scope.forgotPasswordForm.$invalid) {
          return;
        }

        $scope.submitInProgress = true;
        User.fetchPasswordResetQuestions($scope.passwordRecovery.username).then(
          function (result) {
            $scope.submitInProgress = false;
            $scope.passwordRecovery.questions = result;
          }, function (error) {
            error.dismiss();
            $scope.submitInProgress = false;
            $scope.passwordRecovery.usernameFailed = true;
          }
        );
      },
      questions: null, // format: {QuestionId: int, QuestionText: string, Answer: string}
      questionsFailed: false,
      submitQuestions: function () {
        $scope.passwordRecovery.questionsFailed = false;

        $scope.forgotPasswordValidity = angular.copy($scope.forgotPasswordForm);

        // having an ng-repeat makes this validity snapshot pattern tricky:
        // each question is its own sub-form to avoid input name collisions
        // and the template publishes each (sub)form controller onto the
        // corresponding question object as $form, via ng-init directive
        angular.forEach($scope.passwordRecovery.questions, function (question) {
          question.$invalid = question.Answer ? false : true;
        });

        if ($scope.forgotPasswordForm.$invalid) {
          return;
        }

        $scope.submitInProgress = true;
        User.resetPassword($scope.passwordRecovery.username, $scope.passwordRecovery.questions).then(
          function (/*success*/) {
            $scope.submitInProgress = false;
            $scope.showSuccessMessage();
          }, function (error) {
            error.dismiss();
            $scope.submitInProgress = false;
            $scope.passwordRecovery.questionsFailed = true;
          }
        );
      },
      submit: function () {
        if (!$scope.passwordRecovery.questions) {
          $scope.passwordRecovery.submitUsername();
        } else {
          $scope.passwordRecovery.submitQuestions();
        }
      },
      getInputId: function (question) {
        return 'question' + question.QuestionId;
      }
    };

    $scope.showSuccessMessage = function () {
      var title = gettextCatalog.getString('Success'),
        msg = gettextCatalog.getString('Thank you, check your email for the requested account information.'),
        buttons = [{label: gettextCatalog.getString('OK'), cssClass: 'btn-cta cta-primary'}];
      $dialog.messageBox(title, msg, buttons).open().then(
        function () {
          $state.transitionTo('login');
        }
      );
    };

  });
