'use strict';

describe('Directive: navBar', function () {
  beforeEach(module('nextgearWebApp', 'scripts/directives/navBar/navBar.html'));

  var element;

  describe('controller', function () {
    var scope,
      state,
      userMock = {
        isDealer: function(){ return true; },
        getInfo: function(){
          return {
            thing: 'this'
          };
        }
      };

    beforeEach(inject(function ($rootScope, $controller, $state) {
      scope = $rootScope.$new();
      state = $state;

      $controller('NavBarCtrl', {
        $scope: scope,
        $state: state,
        User: userMock
      });
    }));

    it('should attach a user object to the scope', function() {
      expect(scope.user).toBeDefined();
    });

    describe('user object', function() {
      it('should have an isDealer function', function() {
        expect(scope.user.isDealer).toBeDefined();
        expect(typeof scope.user.isDealer).toBe('function');
      });

      it('should have an info function', function() {
        expect(scope.user.info).toBeDefined();
        expect(typeof scope.user.info).toBe('function');
      });

      it('should have a logout function that returns the user to the login page', function() {
        spyOn(state, 'transitionTo').andCallThrough();
        expect(scope.user.logout).toBeDefined();
        expect(typeof scope.user.logout).toBe('function');

        var res = scope.user.logout();
        expect(state.transitionTo).toHaveBeenCalledWith('login');
      });

      it('should have a navLinks function that returns appropriate dealer or auction links', function() {
        expect(scope.user.navLinks).toBeDefined();
        expect(typeof scope.user.navLinks).toBe('function');

        var myLinks = scope.user.navLinks();
        expect(myLinks).toBeDefined();
        expect(typeof myLinks).toBe('object');
      });
    });

    it('should have an isActive function', function() {
      expect(scope.isActive).toBeDefined();
      expect(typeof scope.isActive).toBe('function');
    });
  });
});
