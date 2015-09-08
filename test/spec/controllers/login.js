'use strict';

describe('Controller: LoginCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var LoginCtrl,
    scope,
    localStorageService,
    user,
    shouldPassAuthentication;

  var LOGIN_ERROR_MESSAGE = 'We\'re sorry, but you used a username or password that doesn\'t match our records.';


  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $injector) {

    scope = $rootScope.$new();

    // Mock the login form. Method authenticate checks on it to workaround autofill issue.
    scope.loginForm = {
      credUsername: { $setViewValue: function() {} },
      credPassword: { $setViewValue: function() {} }
    };

    var httpBackend = $injector.get('$httpBackend');
    httpBackend.when('GET', '/DSCConfigurationService/VirtualOfficeNotificationService.svc/msg?lang=1').respond('foo');

    user = {};
    user.authenticate = jasmine.createSpy('authenticate').and.returnValue({
      then: function(success, error) {
        if(shouldPassAuthentication) {
          success({});
        } else {
          error({
            dismiss: angular.noop,
            text: 'Error text'
          });
        }
      }
    });

    localStorageService = {
      value: {},
      get: function(item) {
        return this.value[item];
      },
      set: function(item, value) {
        this.value[item] = value;
      }
    };

    LoginCtrl = $controller('LoginCtrl', {
      $scope: scope,
      $httpBackend: httpBackend,
      localStorageService: localStorageService,
      User: user
    });

  }));

  describe('Saving usernames with autocomplete', function() {

    beforeEach(function(){
      localStorageService.value = {};
    });

    it('should save one username', function() {
      scope.saveAutocompleteUsername('test_username');
      expect(localStorageService.get('autocompleteUsernames')).toEqual(['test_username']);
    });

    it('should save multiple username', function() {
      var array = [];
      for(var i = 0; i < 3; ++i){
        array[i] = 'test_username'+i;
        scope.saveAutocompleteUsername('test_username'+i);
      }
      expect(localStorageService.get('autocompleteUsernames')).toEqual(array);
    });

    it('should save only 10 username', function() {
      var array = [];
      for(var i = 0; i < 15; ++i){
        array[i] = 'test_username'+i;
        scope.saveAutocompleteUsername('test_username'+i);
      }
      expect(localStorageService.get('autocompleteUsernames').length).toEqual(10);
    });

    it('should only save a username once', function() {
      scope.saveAutocompleteUsername('test_username');
      scope.saveAutocompleteUsername('test_username');
      scope.saveAutocompleteUsername('test_username1');
      scope.saveAutocompleteUsername('test_username1');
      scope.saveAutocompleteUsername('test_username1');
      expect(localStorageService.get('autocompleteUsernames').length).toEqual(2);
    });


  });

  describe('save username', function() {
    beforeEach(function() {
      localStorageService.value = {};
    });

    it('should set username to empty and remember to false initially', function() {
      expect(scope.credentials.remember).toBe(false);
      expect(scope.credentials.username).toBe('');
    });

    it('should save username when remember checkbox is checked', function() {
      scope.credentials.remember = true;
      scope.credentials.username = "123username";
      scope.saveUsername();
      expect(localStorageService.value.rememberUsername).toBe('123username');
    });

    it('should unsave password if checkbox is unchecked', function() {
      scope.credentials.remember = true;
      scope.credentials.username = '123username';
      scope.saveUsername();
      scope.credentials.remember = false;
      scope.credentials.username = 'otherUsername';
      scope.saveUsername();
      expect(localStorageService.value.rememberUsername).toBe('')
    });
  });

  describe('authenticate method', function() {

    beforeEach(function() {
      user.authenticate = jasmine.createSpy('authenticate').and.returnValue({
        then: function(success, error) {
          if(shouldPassAuthentication) {
            success({});
          } else {
            error({
              dismiss: angular.noop,
              text: 'Error text',
              status: 200
            });
          }
        }
      });
    });

    it('should pass authentication', function() {
      scope.credentials.username = "thisUsername";
      scope.credentials.password = "thisPassword";
      spyOn(scope, 'saveAutocompleteUsername');
      shouldPassAuthentication = true;
      scope.authenticate();

      expect(user.authenticate).toHaveBeenCalledWith('thisUsername', 'thisPassword');
      expect(scope.saveAutocompleteUsername).toHaveBeenCalled();
    });

    it('should fail authentication (general non server error)', function() {
      scope.credentials.username = "thisUsername";
      scope.credentials.password = "thisPassword";
      spyOn(scope, 'saveAutocompleteUsername');
      expect(scope.showLoginError).toBeFalsy();
      expect(scope.errorMsg).toBeFalsy();
      shouldPassAuthentication = false;
      scope.authenticate();

      expect(user.authenticate).toHaveBeenCalledWith('thisUsername', 'thisPassword');
      expect(scope.saveAutocompleteUsername).not.toHaveBeenCalled();
      expect(scope.credentials.password).toBe('');
      expect(scope.errorMsg).toBe(LOGIN_ERROR_MESSAGE);
      expect(scope.showLoginError).toBe(true);
    });
  });

  describe('authenticate method, server error', function() {

    beforeEach(function() {

      user.authenticate = jasmine.createSpy('authenticate500').and.returnValue({
        then: function(success, error) {
          if(shouldPassAuthentication) {
            success({});
          } else {
            error({
              dismiss: angular.noop,
              text: 'Error text',
              status: 500
            });
          }
        }
      });
    });

    it('should fail authentication (server error)', function() {
      scope.credentials.username = "thisUsername";
      scope.credentials.password = "thisPassword";
      spyOn(scope, 'saveAutocompleteUsername');
      expect(scope.showLoginError).toBeFalsy();
      expect(scope.errorMsg).toBeFalsy();
      shouldPassAuthentication = false;
      scope.authenticate();

      expect(user.authenticate).toHaveBeenCalledWith('thisUsername', 'thisPassword');
      expect(scope.saveAutocompleteUsername).not.toHaveBeenCalled();
      expect(scope.credentials.password).toBe('');
      expect(scope.errorMsg).toBe('Error text');
      expect(scope.showLoginError).toBe(true);
    });

  });

});
