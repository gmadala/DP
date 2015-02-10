'use strict';

describe('Directive: navBar', function () {
  beforeEach(module('nextgearWebApp', 'scripts/directives/navBar/navBar.html'));

  var element;

  describe('controller', function () {
    var scope,
      aScope,
      $rootScope,
      $controller,
      state,
      stateMock,
      shouldShowTRP,
      dMock,
      aMock;

    beforeEach(inject(function (_$rootScope_, _$controller_, $state, $q) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      scope = $rootScope.$new();

      stateMock = {
        current: 'floorcar',
        transitionTo: function(newState) {
          stateMock.current = newState;
        },
        includes: function(param) {
          return stateMock.current.indexOf(param) != -1;
        }
      };
      shouldShowTRP = false;
      dMock = {
        isDealer: function(){ return true; },
        getShowReports: function(){return true;},
        getInfo: function(){
          return $q.when({ DisplayTitleReleaseProgram: shouldShowTRP });
        },
        isLoggedIn: function() {
          return true;
        }
      };
      aMock = {
        isDealer: function(){ return false; },
        getShowReports: function(){return true;},
        getInfo: function() {
          return $q.when({ DisplayTitleReleaseProgram: false });
        },
        isLoggedIn: function() {
          return true;
        }
      };

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
      scope.$apply();
      expect(scope.user).toBeDefined();
    });

    describe('user object', function() {
      beforeEach(function() {
        scope.$apply(); // trigger initial $watch
      });

      it('should have an isDealer function', function() {
        expect(scope.user.isDealer).toBeDefined();
        expect(typeof scope.user.isDealer).toBe('function');
      });

      it('should have a logout function that dispatches a userRequestedLogout event', function() {
        spyOn($rootScope, '$emit');
        expect(scope.user.logout).toBeDefined();
        expect(typeof scope.user.logout).toBe('function');

        scope.user.logout();
        expect($rootScope.$emit).toHaveBeenCalledWith('event:userRequestedLogout');
      });

      it('should have a navLinks function that returns appropriate dealer or auction links', function() {
        expect(scope.user.navLinks).toBeDefined();
        expect(typeof scope.user.navLinks).toBe('function');

        var myLinks = scope.user.navLinks();

        // dealers have 7 primary links and 3 secondary links (excluding conditional TRP link)
        expect(myLinks.primary.length).toBe(6);
        expect(myLinks.secondary.length).toBe(3);

        myLinks = aScope.user.navLinks();
        // auctions have 6 primary links and no secondary links
        expect(myLinks.primary.length).toBe(6);
        expect(myLinks.secondary).not.toBeDefined();
      });

      it('should include a title release link only if the user has DisplayTitleReleaseProgram set to true', function() {
        shouldShowTRP = true;

        $controller('NavBarCtrl', {
          $scope: scope,
          $state: stateMock,
          User: dMock
        });
        scope.$apply();
        expect(scope.user.navLinks().primary.length).toBe(7);
      });

      it('should refresh if showing title release address if user goes from being logged out to logged in', function() {
        var loggedIn = false;
        spyOn(dMock, 'isLoggedIn').andCallFake(function(){ return loggedIn; });
        shouldShowTRP = true;

        $controller('NavBarCtrl', {
          $scope: scope,
          $state: stateMock,
          User: dMock
        });
        $rootScope.$digest();
        expect(scope.user.navLinks().primary.length).toBe(6);
        loggedIn = true;
        $rootScope.$digest();
        expect(scope.user.navLinks().primary.length).toBe(7);
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
    describe('showReports method', function () {
      it('show Reports Tab for dealer-portal', function () {
        var bScope = $rootScope.$new();
        spyOn(dMock, 'getShowReports').andReturn(true);
        $controller('NavBarCtrl', {
          $scope: bScope,
          $state: stateMock,
          User: dMock
        });
        bScope.$apply();
        expect(bScope.user.navLinks().primary.length).toBe(6);
        expect(bScope.user.navLinks().primary[4].showTab).toBe(true);
      });
      it('hide Reports Tab for dealer-portal', function () {
        var bScope = $rootScope.$new();
        spyOn(dMock, 'getShowReports').andReturn(false);
        $controller('NavBarCtrl', {
          $scope: bScope,
          $state: stateMock,
          User: dMock
        });
        bScope.$apply();
        expect(bScope.user.navLinks().primary.length).toBe(6);
        expect(bScope.user.navLinks().primary[4].showTab).toBe(false);
      });
      it('show Reports Tab for auction-portal', function () {
        var bScope = $rootScope.$new();
        spyOn(aMock, 'getShowReports').andReturn(true);
        $controller('NavBarCtrl', {
          $scope: bScope,
          $state: stateMock,
          User: aMock
        });
        bScope.$apply();
        expect(bScope.user.navLinks().primary.length).toBe(6);
        expect(bScope.user.navLinks().primary[4].showTab).toBe(true);
      });
      it('hide Reports Tab for auction-portal', function () {
        var bScope = $rootScope.$new();
        spyOn(aMock, 'getShowReports').andReturn(false);
        $controller('NavBarCtrl', {
          $scope: bScope,
          $state: stateMock,
          User: aMock
        });
        bScope.$apply();
        expect(bScope.user.navLinks().primary.length).toBe(6);
        expect(bScope.user.navLinks().primary[4].showTab).toBe(false);
      });
    });
  });
});
