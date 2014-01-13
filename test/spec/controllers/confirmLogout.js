'use strict';

describe('Controller: ConfirmLogoutCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var ConfirmLogoutCtrl,
    scope,
    rootScope,
    dialog,
    user;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $q, User) {
    scope = $rootScope.$new();
    rootScope = $rootScope;
    dialog = {
      close: jasmine.createSpy('close')
    };
    user = User;

    spyOn(user, 'logout').andReturn($q.when('OK'));

    ConfirmLogoutCtrl = $controller('ConfirmLogoutCtrl', {
      $scope: scope,
      dialog: dialog
    });
  }));

  it('should attach a logoutPending flag, default of false, to the scope', function () {
    expect(scope.logoutPending).toBe(false);
  });

  describe('scope close function', function () {

    it('should just close the dialog immediately w/ result, if called with false', function () {
      scope.close(false);
      expect(user.logout).not.toHaveBeenCalled();
      expect(scope.logoutPending).toBe(false);
      expect(dialog.close).toHaveBeenCalledWith(false);
    });

    it('should set the logoutPending flag to true and leave dialog open, if called with true', function () {
      scope.close(true);
      expect(scope.logoutPending).toBe(true);
      expect(dialog.close).not.toHaveBeenCalled();
    });

    it('should call user logout, if called with true', function () {
      scope.close(true);
      expect(user.logout).toHaveBeenCalled();
    });

    it('should set logoutPending to false and close the dialog on result of logout call', function () {
      scope.close(true);
      rootScope.$apply();
      expect(scope.logoutPending).toBe(false);
      expect(dialog.close).toHaveBeenCalledWith(true);
    });

  });

});
