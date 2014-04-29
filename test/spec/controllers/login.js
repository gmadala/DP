'use strict';

describe('Controller: LoginCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var LoginCtrl,
    scope,
    localStorageService,
    user,
    shouldPassAuthentication;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $injector) {

    scope = $rootScope.$new();

    var httpBackend = $injector.get('$httpBackend');
    httpBackend.when('GET', '/DSCConfigurationService/VirtualOfficeNotificationService.svc/msg').respond('foo');

    user = {};
    user.authenticate = jasmine.createSpy('authenticate').andReturn({
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

  describe('authenticate method', function() {
    it('should pass authentication', function() {
      scope.credentials.username = "thisUsername";
      scope.credentials.password = "thisPassword";
      spyOn(scope, 'saveAutocompleteUsername');
      shouldPassAuthentication = true;
      scope.authenticate();

      expect(user.authenticate).toHaveBeenCalledWith('thisUsername', 'thisPassword');
      expect(scope.saveAutocompleteUsername).toHaveBeenCalled();
    });

    it('should fail authentication', function() {
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
