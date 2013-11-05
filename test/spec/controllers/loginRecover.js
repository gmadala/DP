'use strict';

describe('Controller: LoginRecoverCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var LoginRecoverCtrl,
    scope,
    state,
    $dialog,
    dialog;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$dialog_, $q) {
    scope = $rootScope.$new();
    state = {
      transitionTo: angular.noop
    };

    dialog = {
      open: function () {
        return $q.when(undefined);
      }
    };
    $dialog = _$dialog_;
    spyOn($dialog, 'messageBox').andReturn(dialog);

    LoginRecoverCtrl = $controller('LoginRecoverCtrl', {
      $scope: scope,
      $state: state
    });
  }));

  describe('userNameRecovery', function () {

    it('should have an email model property defaulted to null', function () {
      expect(scope.userNameRecovery.email).toBe(null);
    });

    it('should have an failed model property defaulted to false', function () {
      expect(scope.userNameRecovery.failed).toBe(false);
    });

    describe('submit function', function () {

      var user, $q, messages;

      beforeEach(inject(function (_$q_, _messages_, User) {
        user = User;
        $q = _$q_;
        messages = _messages_;

        scope.forgotUserNameForm = {
          $invalid: true
        };
      }));

      it('should reset the failed flag', function () {
        scope.userNameRecovery.failed = true;
        scope.userNameRecovery.submit();
        expect(scope.userNameRecovery.failed).toBe(false);
      });

      it('should create a clone of the form controller for validity display', function () {
        scope.userNameRecovery.submit();
        expect(angular.equals(scope.forgotUserNameValidity, scope.forgotUserNameForm)).toBe(true);
      });

      it('should skip the call if the form is invalid', function () {
        spyOn(user, 'recoverUserName').andReturn($q.when('OK'));
        scope.userNameRecovery.submit();
        expect(user.recoverUserName).not.toHaveBeenCalled();
        expect(scope.submitInProgress).not.toBe(true);
      });

      it('should set submitInProgress on start of call', function () {
        spyOn(user, 'recoverUserName').andReturn($q.when('OK'));
        scope.forgotUserNameForm.$invalid = false;
        scope.userNameRecovery.submit();
        expect(scope.submitInProgress).toBe(true);
      });

      it('should call the recoverUserName method on the model with the email address', function () {
        spyOn(user, 'recoverUserName').andReturn($q.when('OK'));
        scope.forgotUserNameForm.$invalid = false;
        scope.userNameRecovery.email = 'foo@example.com';
        scope.userNameRecovery.submit();
        expect(user.recoverUserName).toHaveBeenCalledWith('foo@example.com');
      });

      it('should set submitInProgress to false on success', function () {
        spyOn(user, 'recoverUserName').andReturn($q.when('OK'));
        scope.forgotUserNameForm.$invalid = false;
        scope.userNameRecovery.submit();
        scope.$apply();
        expect(scope.submitInProgress).toBe(false);
      });

      it('should set submitInProgress to false on error', function () {
        spyOn(user, 'recoverUserName').andReturn($q.reject(messages.add('oops')));
        scope.forgotUserNameForm.$invalid = false;
        scope.userNameRecovery.submit();
        scope.$apply();
        expect(scope.submitInProgress).toBe(false);
      });

      it('should invoke success message on success', function () {
        spyOn(user, 'recoverUserName').andReturn($q.when('OK'));
        spyOn(scope, 'showSuccessMessage');
        scope.forgotUserNameForm.$invalid = false;
        scope.userNameRecovery.submit();
        scope.$apply();
        expect(scope.showSuccessMessage).toHaveBeenCalled();
      });

      it('should set failed flag on error', function () {
        spyOn(user, 'recoverUserName').andReturn($q.reject(messages.add('oops')));
        scope.forgotUserNameForm.$invalid = false;
        scope.userNameRecovery.submit();
        scope.$apply();
        expect(scope.userNameRecovery.failed).toBe(true);
      });

      it('should suppress global error display on error', function () {
        spyOn(user, 'recoverUserName').andReturn($q.reject(messages.add('oops')));
        scope.forgotUserNameForm.$invalid = false;
        scope.userNameRecovery.submit();
        scope.$apply();
        expect(messages.list().length).toBe(0);
      });

    });

  });

  describe('passwordRecovery', function () {

    it('should have a username model property defaulted to null', function () {
      expect(scope.passwordRecovery.username).toBe(null);
    });

    it('should have a usernameFailed model property defaulted to false', function () {
      expect(scope.passwordRecovery.usernameFailed).toBe(false);
    });

    it('should have a questions model property defaulted to null', function () {
      expect(scope.passwordRecovery.questions).toBe(null);
    });

    it('should have a questionsFailed model property defaulted to false', function () {
      expect(scope.passwordRecovery.questionsFailed).toBe(false);
    });

    it('should have a getInputId function that returns an HTML id based on provided question id', function () {
      var result = scope.passwordRecovery.getInputId({ QuestionId: 27 });
      expect(result).toBe('question27');
    });

    describe('submit function', function () {

      it('should invoke submitUsername if questions are not yet loaded', function () {
        scope.passwordRecovery.questions = null;
        spyOn(scope.passwordRecovery, 'submitUsername');
        spyOn(scope.passwordRecovery, 'submitQuestions');
        scope.passwordRecovery.submit();
        expect(scope.passwordRecovery.submitUsername).toHaveBeenCalled();
        expect(scope.passwordRecovery.submitQuestions).not.toHaveBeenCalled();
      });

      it('should invoke submitQuestions if questions already loaded', function () {
        scope.passwordRecovery.questions = [];
        spyOn(scope.passwordRecovery, 'submitUsername');
        spyOn(scope.passwordRecovery, 'submitQuestions');
        scope.passwordRecovery.submit();
        expect(scope.passwordRecovery.submitUsername).not.toHaveBeenCalled();
        expect(scope.passwordRecovery.submitQuestions).toHaveBeenCalled();
      });

    });

    describe('submitUsername function', function () {

      var user, $q, messages;

      beforeEach(inject(function (_$q_, _messages_, User) {
        user = User;
        $q = _$q_;
        messages = _messages_;

        scope.forgotPasswordForm = {
          $invalid: true
        };
      }));

      it('should reset the usernameFailed flag', function () {
        scope.passwordRecovery.usernameFailed = true;
        scope.passwordRecovery.submitUsername();
        expect(scope.passwordRecovery.usernameFailed).toBe(false);
      });

      it('should create a clone of the form controller for validity display', function () {
        scope.passwordRecovery.submitUsername();
        expect(angular.equals(scope.forgotPasswordValidity, scope.forgotPasswordForm)).toBe(true);
      });

      it('should skip the call if the form is invalid', function () {
        spyOn(user, 'fetchPasswordResetQuestions').andReturn($q.when([]));
        scope.passwordRecovery.submitUsername();
        expect(user.fetchPasswordResetQuestions).not.toHaveBeenCalled();
        expect(scope.submitInProgress).not.toBe(true);
      });

      it('should set submitInProgress on start of call', function () {
        spyOn(user, 'fetchPasswordResetQuestions').andReturn($q.when([]));
        scope.forgotPasswordForm.$invalid = false;
        scope.passwordRecovery.submitUsername();
        expect(scope.submitInProgress).toBe(true);
      });

      it('should call the fetchPasswordResetQuestions method on the model with the username', function () {
        spyOn(user, 'fetchPasswordResetQuestions').andReturn($q.when([]));
        scope.forgotPasswordForm.$invalid = false;
        scope.passwordRecovery.username = 'foo';
        scope.passwordRecovery.submitUsername();
        expect(user.fetchPasswordResetQuestions).toHaveBeenCalledWith('foo');
      });

      it('should set submitInProgress to false on success', function () {
        spyOn(user, 'fetchPasswordResetQuestions').andReturn($q.when([]));
        scope.forgotPasswordForm.$invalid = false;
        scope.passwordRecovery.submitUsername();
        scope.$apply();
        expect(scope.submitInProgress).toBe(false);
      });

      it('should set submitInProgress to false on error', function () {
        spyOn(user, 'fetchPasswordResetQuestions').andReturn($q.reject(messages.add('oops')));
        scope.forgotPasswordForm.$invalid = false;
        scope.passwordRecovery.submitUsername();
        scope.$apply();
        expect(scope.submitInProgress).toBe(false);
      });

      it('should attach the retrieved questions to the scope on success', function () {
        var questions = [];
        spyOn(user, 'fetchPasswordResetQuestions').andReturn($q.when(questions));
        scope.forgotPasswordForm.$invalid = false;
        scope.passwordRecovery.submitUsername();
        scope.$apply();
        expect(scope.passwordRecovery.questions).toBe(questions);
      });

      it('should set usernameFailed flag on error', function () {
        spyOn(user, 'fetchPasswordResetQuestions').andReturn($q.reject(messages.add('oops')));
        scope.forgotPasswordForm.$invalid = false;
        scope.passwordRecovery.submitUsername();
        scope.$apply();
        expect(scope.passwordRecovery.usernameFailed).toBe(true);
      });

      it('should suppress global error display on error', function () {
        spyOn(user, 'fetchPasswordResetQuestions').andReturn($q.reject(messages.add('oops')));
        scope.forgotPasswordForm.$invalid = false;
        scope.passwordRecovery.submitUsername();
        scope.$apply();
        expect(messages.list().length).toBe(0);
      });

    });

    describe('submitQuestions function', function () {

      var user, $q, messages;

      beforeEach(inject(function (_$q_, _messages_, User) {
        user = User;
        $q = _$q_;
        messages = _messages_;

        scope.forgotPasswordForm = {
          $invalid: true
        };

        scope.passwordRecovery.questions = [
          {
            QuestionId: 0,
            QuestionText: 'foo',
            Answer: 'foo_answer', // set by ng-model
            $form: { something: 'ok' } // set by ng-form + ng-init
          },
          {
            QuestionId: 1,
            QuestionText: 'bar',
            Answer: 'bar_answer', // set by ng-model
            $form: { something: 'another value' } // set by ng-form + ng-init
          }
        ];
      }));

      it('should reset the questionsFailed flag', function () {
        scope.passwordRecovery.questionsFailed = true;
        scope.passwordRecovery.submitQuestions();
        expect(scope.passwordRecovery.questionsFailed).toBe(false);
      });

      it('should create a clone of the main form controller for validity display', function () {
        scope.passwordRecovery.submitQuestions();
        expect(angular.equals(scope.forgotPasswordValidity, scope.forgotPasswordForm)).toBe(true);
      });

      it('should skip the call if the form is invalid', function () {
        spyOn(user, 'resetPassword').andReturn($q.when('OK'));
        scope.passwordRecovery.submitQuestions();
        expect(user.resetPassword).not.toHaveBeenCalled();
        expect(scope.submitInProgress).not.toBe(true);
      });

      it('should set submitInProgress on start of call', function () {
        spyOn(user, 'resetPassword').andReturn($q.when('OK'));
        scope.forgotPasswordForm.$invalid = false;
        scope.passwordRecovery.submitQuestions();
        expect(scope.submitInProgress).toBe(true);
      });

      it('should call the resetPassword method on the model with the username and questions', function () {
        spyOn(user, 'resetPassword').andReturn($q.when('OK'));
        scope.forgotPasswordForm.$invalid = false;
        scope.passwordRecovery.username = 'foo';
        scope.passwordRecovery.submitQuestions();
        expect(user.resetPassword).toHaveBeenCalledWith('foo', scope.passwordRecovery.questions);
      });

      it('should set submitInProgress to false on success', function () {
        spyOn(user, 'resetPassword').andReturn($q.when('OK'));
        scope.forgotPasswordForm.$invalid = false;
        scope.passwordRecovery.submitQuestions();
        scope.$apply();
        expect(scope.submitInProgress).toBe(false);
      });

      it('should set submitInProgress to false on error', function () {
        spyOn(user, 'resetPassword').andReturn($q.reject(messages.add('oops')));
        scope.forgotPasswordForm.$invalid = false;
        scope.passwordRecovery.submitQuestions();
        scope.$apply();
        expect(scope.submitInProgress).toBe(false);
      });

      it('should invoke success message on success', function () {
        spyOn(user, 'resetPassword').andReturn($q.when('OK'));
        spyOn(scope, 'showSuccessMessage');
        scope.forgotPasswordForm.$invalid = false;
        scope.passwordRecovery.submitQuestions();
        scope.$apply();
        expect(scope.showSuccessMessage).toHaveBeenCalled();
      });

      it('should set questionsFailed flag on error', function () {
        spyOn(user, 'resetPassword').andReturn($q.reject(messages.add('oops')));
        scope.forgotPasswordForm.$invalid = false;
        scope.passwordRecovery.submitQuestions();
        scope.$apply();
        expect(scope.passwordRecovery.questionsFailed).toBe(true);
      });

      it('should suppress global error display on error', function () {
        spyOn(user, 'resetPassword').andReturn($q.reject(messages.add('oops')));
        scope.forgotPasswordForm.$invalid = false;
        scope.passwordRecovery.submitQuestions();
        scope.$apply();
        expect(messages.list().length).toBe(0);
      });

    });

  });

  describe('showSuccessMessage function', function () {

    it('should invoke a messageBox with the expected content', function () {
      scope.showSuccessMessage();
      expect($dialog.messageBox).toHaveBeenCalled();
      expect(typeof $dialog.messageBox.mostRecentCall.args[0]).toBe('string');
      expect(typeof $dialog.messageBox.mostRecentCall.args[1]).toBe('string');
      expect(angular.isArray($dialog.messageBox.mostRecentCall.args[2])).toBe(true);
    });

    it('should transition to the login state on message box close', function () {
      spyOn(state, 'transitionTo');
      scope.showSuccessMessage();
      scope.$apply();
      expect(state.transitionTo).toHaveBeenCalledWith('login');
    });

  });

});
