'use strict';

describe('Directive: navBar', function () {
  beforeEach(module('nextgearWebApp', 'scripts/directives/navBar/navBar.html'));

  var element;

  describe('controller', function () {
    var scope,
      aScope,
      rootScope,
      state,
      stateMock = {
        current: 'floorcar',
        transitionTo: function(newState) {
          stateMock.current = newState;
        },
        includes: function(param) {
          return stateMock.current.indexOf(param) != -1;
        }
      },
      dMock = {
        isDealer: function(){ return true; },
        getInfo: function(){
          return {
            thing: 'this',
          };
        }
      },
      aMock = {
        isDealer: function(){ return false; }
      };

    beforeEach(inject(function ($rootScope, $controller, $state) {
      rootScope = $rootScope;
      scope = $rootScope.$new();

      $controller('NavBarCtrl', {
        $scope: scope,
        $state: stateMock,
        User: dMock
      });

      aScope = $rootScope.$new();
      $controller('NavBarCtrl', {
        $scope: aScope,
        User: aMock
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

      it('should have a logout function that dispatches a userRequestedLogout event', function() {
        spyOn(rootScope, '$emit');
        expect(scope.user.logout).toBeDefined();
        expect(typeof scope.user.logout).toBe('function');

        scope.user.logout();
        expect(rootScope.$emit).toHaveBeenCalledWith('event:userRequestedLogout');
      });

      it('should have a navLinks function that returns appropriate dealer or auction links', function() {
        expect(scope.user.navLinks).toBeDefined();
        expect(typeof scope.user.navLinks).toBe('function');

        var myLinks = scope.user.navLinks();
        // dealers have 8 primary links and 2 secondary links
        expect(myLinks.primary.length).toBe(8);
        expect(myLinks.secondary.length).toBe(2);

        myLinks = aScope.user.navLinks();
        // auctions have 6 primary links and no secondary links
        expect(myLinks.primary.length).toBe(6);
        expect(myLinks.secondary).not.toBeDefined();
      });

      it('should change the homelink based on user type', function() {
        expect(scope.user.homeLink).toBeDefined();
        expect(typeof scope.user.homeLink).toBe('function');

        var ret = scope.user.homeLink();
        expect(ret).toBe('#/home');

        ret = aScope.user.homeLink();
        expect(ret).toBe('#/act/home');
      });
    });

    describe('isActive function', function() {
      it('should exist', function(){
        expect(scope.isActive).toBeDefined();
        expect(typeof scope.isActive).toBe('function');
      });

      it('should return true if we are on the given page', function() {
        var ret = scope.isActive('floorcar'),
            ret2 = scope.isActive('auction_reports');
        expect(ret).toBe(true);
        expect(ret2).toBe(false);
      });
    });
  });
});
