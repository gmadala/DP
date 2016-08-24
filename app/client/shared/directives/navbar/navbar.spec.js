'use strict';

describe('Directive: navBar', function () {
  beforeEach(module('nextgearWebApp', 'client/shared/directives/navbar/navbar.template.html'));

  describe('controller', function () {
    var scope,
      aScope,
      $rootScope,
      $controller,
      stateMock,
      kissMetricData,
      mockKissMetricInfo,
      shouldShowTRP,
      dMock,
      aMock,
      mockCustomerSupportPhone;

    beforeEach(inject(function (_$rootScope_, _$controller_, $state, $q) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      scope = $rootScope.$new();

      kissMetricData = {
        height: 1080,
        isBusinessHours: true,
        vendor: 'Google Inc.',
        version: 'Chrome 44',
        width: 1920
      };

      mockKissMetricInfo = {
        getKissMetricInfo: function () {
          return $q.when(kissMetricData);
        }
      };

      spyOn(mockKissMetricInfo, 'getKissMetricInfo').and.callThrough();

      stateMock = {
        current: 'floorcar',
        transitionTo: function (newState) {
          stateMock.current = newState;
        },
        includes: function (param) {
          return stateMock.current.indexOf(param) != -1;
        }
      };
      shouldShowTRP = false;
      dMock = {
        isDealer: function () {
          return true;
        },
        isUnitedStates: function () {
          return true;
        },
        getShowReportsAndResources: function () {
          return $q.when(false);
        },
        getInfo: function () {
          return $q.when({ DisplayTitleReleaseProgram: shouldShowTRP });
        },
        isLoggedIn: function () {
          return true;
        },
        getFeatures: function () {
          return {
            autoPay: { enabled: true },
            addBankAccount: { enabled: true },
            editBankAccount: { enabled: true },
            uploadDocuments: { enabled: true },
            uploadDocumentsAuction: { enabled: true }
          };
        }
      };
      aMock = {
        isDealer: function () {
          return false;
        },
        isUnitedStates: function () {
          return false;
        },
        getShowReportsAndResources: function () {
          return $q.when(false);
        },
        getInfo: function () {
          return $q.when({ DisplayTitleReleaseProgram: false });
        },
        isLoggedIn: function () {
          return true;
        },
        getFeatures: function () {
          return {
            autoPay: { enabled: true },
            addBankAccount: { enabled: true },
            editBankAccount: { enabled: true },
            uploadDocuments: { enabled: true },
            uploadDocumentsAuction: { enabled: true },
            eventSales: { enabled: true }
          };
        }
      };

      mockCustomerSupportPhone = $q.when({
        value: '1234567890',
        formatted: '123-456-7890'
      });

      $controller('NavBarCtrl', {
        $scope: scope,
        $state: stateMock,
        User: dMock,
        kissMetricInfo: mockKissMetricInfo,
        dealerCustomerSupportPhone: mockCustomerSupportPhone
      });

      aScope = $rootScope.$new();

      $controller('NavBarCtrl', {
        $scope: aScope,
        User: aMock,
        kissMetricInfo: mockKissMetricInfo,
        dealerCustomerSupportPhone: mockCustomerSupportPhone
      });
    }));

    it('should call to get core properties from kissmetric info service', function () {
      scope.$apply();
      expect(mockKissMetricInfo.getKissMetricInfo).toHaveBeenCalled();
      expect(scope.kissMetricData).toEqual(kissMetricData);
    });

    it('should attach a user object to the scope', function () {
      scope.$apply();
      expect(scope.user).toBeDefined();
    });

    describe('user object', function () {
      beforeEach(function () {
        scope.$apply(); // trigger initial $watch
      });

      it('should have an isDealer function', function () {
        expect(scope.user.isDealer).toBeDefined();
        expect(typeof scope.user.isDealer).toBe('function');
      });

      it('should have a logout function that dispatches a userRequestedLogout event', function () {
        spyOn($rootScope, '$emit');
        expect(scope.user.logout).toBeDefined();
        expect(typeof scope.user.logout).toBe('function');

        scope.user.logout();
        expect($rootScope.$emit).toHaveBeenCalledWith('event:userRequestedLogout');
      });

      it('should have a navLinks function that returns appropriate dealer or auction links', function () {
        expect(scope.user.navLinks).toBeDefined();
        expect(typeof scope.user.navLinks).toBe('function');

        var myLinks = scope.user.navLinks();
        // dealers have 4 primary links
        expect(myLinks.primary.length).toBe(4);
        expect(myLinks.primary[1].subMenu.length).toBe(2);
        expect(myLinks.primary[2].subMenu.length).toBe(3);
        expect(myLinks.primary[3].subMenu.length).toBe(4);

        myLinks = aScope.user.navLinks();
        // auctions have 6 primary links and no secondary links
        expect(myLinks.primary.length).toBe(6);
      });

      it('should hide the Value Lookup tab for the canadian users', function () {
        var isUnitedStates = false;
        spyOn(dMock, 'isUnitedStates').and.callFake(function () {
          return isUnitedStates;
        });

        $controller('NavBarCtrl', {
          $scope: scope,
          $state: stateMock,
          User: dMock,
          kissMetricInfo: mockKissMetricInfo
        });
        $rootScope.$digest();
        expect(scope.user.navLinks().primary[2].subMenu.length).toBe(2);
      });

      it('should include a title release link only if the user has DisplayTitleReleaseProgram set to true', function () {
        shouldShowTRP = true;

        $controller('NavBarCtrl', {
          $scope: scope,
          $state: stateMock,
          User: dMock,
          kissMetricInfo: mockKissMetricInfo
        });
        scope.$apply();
        expect(scope.user.navLinks().primary[2].subMenu.length).toBe(4);
      });

      it('should refresh if showing title release address if user goes from being logged out to logged in', function () {
        var loggedIn = false;
        spyOn(dMock, 'isLoggedIn').and.callFake(function () {
          return loggedIn;
        });
        shouldShowTRP = true;

        $controller('NavBarCtrl', {
          $scope: scope,
          $state: stateMock,
          User: dMock,
          kissMetricInfo: mockKissMetricInfo
        });
        $rootScope.$digest();
        expect(scope.user.navLinks().primary[2].subMenu.length).toBe(3);
        loggedIn = true;

        scope.initNav().then(function() {          
          $rootScope.$digest();
          expect(scope.user.navLinks().primary[2].subMenu.length).toBe(4);
        });
      });

      it('should change the homelink based on user type', function () {
        expect(scope.user.homeLink).toBeDefined();
        expect(typeof scope.user.homeLink).toBe('function');

        var ret = scope.user.homeLink();
        expect(ret).toBe('#/home');

        ret = aScope.user.homeLink();
        expect(ret).toBe('#/act/home');
      });

    });

    describe('isActive function', function () {
      it('should exist', function () {
        expect(scope.isActive).toBeDefined();
        expect(typeof scope.isActive).toBe('function');
      });

      it('should return true if we are on the given page', function () {
        var ret = scope.isActive('floorcar'),
          ret2 = scope.isActive('auction_reports');
        expect(ret).toBe(true);
        expect(ret2).toBe(false);
      });
    });
  });
});
