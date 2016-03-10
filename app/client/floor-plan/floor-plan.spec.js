'use strict';

describe('Controller: FloorplanCtrl', function () {
  beforeEach(module('nextgearWebApp'));

  var FloorplanCtrl,
    stateParamsMock,
    floorplan,
    modelMock,
    floorplanUtil,
    scope,
    searchSpy,
    shouldSucceed = true,
    initController,
    httpBackend,
    myPlan,
    addressesMock;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $q, Floorplan, FloorplanUtil, $httpBackend) {
    scope = $rootScope.$new();
    stateParamsMock = {
      filter: 'fooFilter'
    };
    floorplan = Floorplan;
    floorplanUtil = FloorplanUtil;
    httpBackend = $httpBackend;

    searchSpy = spyOn(Floorplan, 'search').and.callFake(function() {
      if(shouldSucceed) {
        return $q.when({ Floorplans: ['one', 'two'] });
      } else {
        return $q.reject(false);
      }
    });

    addressesMock = {
      getFlooredBusinessAddresses: function() {
        return [
          {
            AddressId: '1',
            Line1: '380 NEVADA SW',
            Line2: null,
            City: 'HURON',
            State: 'SD',
            Zip: '57350',
            Phone: '0000000000',
            Fax: '0000000000',
            IsActive: false,
            IsPhysicalInventory: false,
            HasFloorplanFlooredAgainst: true,
            HasApprovedFloorplanFlooredAgainst: false,
            IsTitleReleaseAddress: false,
            IsMailingAddress: false,
            IsPostOfficeBox: false
          },
          {
            AddressId: '2',
            Line1: 'PO Box 1274',
            Line2: null,
            City: 'Huron',
            State: 'SD',
            Zip: '57350',
            Phone: '6053521637',
            Fax: '6053524528',
            IsActive: true,
            IsPhysicalInventory: false,
            HasFloorplanFlooredAgainst: true,
            HasApprovedFloorplanFlooredAgainst: false,
            IsTitleReleaseAddress: false,
            IsMailingAddress: true,
            IsPostOfficeBox: true
          },
          {
            AddressId: '4',
            Line1: '1794 1/2 E. Hwy 14',
            Line2: null,
            City: 'Huron',
            State: 'SD',
            Zip: '57350',
            Phone: '6053521637',
            Fax: '6053524528',
            IsActive: false,
            IsPhysicalInventory: true,
            HasFloorplanFlooredAgainst: true,
            HasApprovedFloorplanFlooredAgainst: true,
            IsTitleReleaseAddress: false,
            IsMailingAddress: false,
            IsPostOfficeBox: false
          }
        ];
      }
    };

    initController = function () {
      FloorplanCtrl = $controller('FloorplanCtrl', {
        $scope: scope,
        $stateParams: stateParamsMock,
        Floorplan: floorplan,
        FloorplanUtil: floorplanUtil,
        Addresses: addressesMock
      });

      myPlan = new FloorplanUtil('FlooringDate', stateParamsMock.filter);
    };
  }));

  // shared tests that need to be run for both dealer and auction mode
  var registerCommonTests = function () {
    describe('sellerHasTitle function', function() {
      var fl = {
        TitleLocation: 'Buyer',
        FloorplanId: 1234
      };

      beforeEach(function() {
        spyOn(floorplan, 'sellerHasTitle').and.callThrough();

        httpBackend.expectPOST('/floorplan/SellerHasTitle')
          .respond({
            Success: true,
            Message: null,
            Data: []
          });

        spyOn(angular, 'element').and.returnValue({
          scope: function() {
            return {
              tt_isOpen: ''
            };
          },
          next: function() {
            return {
              hasClass: function() {
                return true;
              },
              css: angular.noop
            };
          }
        });
      });

      it('set title location to Seller if they have the title', function() {
        scope.sellerHasTitle(fl, true);
        httpBackend.flush();
        expect(floorplan.sellerHasTitle).toHaveBeenCalled();
        expect(fl.TitleLocation).toBe('Seller');
      });

      it('set title location to Title Absent if seller does not have the title', function() {
        scope.sellerHasTitle(fl, false);
        httpBackend.flush();
        expect(floorplan.sellerHasTitle).toHaveBeenCalled();
        expect(fl.TitleLocation).toBe('Title Absent');
      });
    });
  };

  describe('(in dealer mode)', function () {
    var floorplan, floorplanUtil;

    beforeEach(inject(function (User, Floorplan, FloorplanUtil) {
      spyOn(User, 'isDealer').and.returnValue(true);
      floorplan = Floorplan;
      floorplanUtil = FloorplanUtil;
      initController();
    }));

    registerCommonTests();

    it('should attach the dealer list of filter options to the scope', function () {
      expect(angular.isArray(scope.filterOptions)).toBe(true);

      expect(scope.filterOptions[0].label).toBe('View All');
      expect(scope.filterOptions[0].value).toBe(floorplan.filterValues.ALL);

      expect(scope.filterOptions[1].label).toBe('Pending');
      expect(scope.filterOptions[1].value).toBe(floorplan.filterValues.PENDING);

      expect(scope.filterOptions[2].label).toBe('Denied');
      expect(scope.filterOptions[2].value).toBe(floorplan.filterValues.DENIED);

      expect(scope.filterOptions[3].label).toBe('Approved');
      expect(scope.filterOptions[3].value).toBe(floorplan.filterValues.APPROVED);

      expect(scope.filterOptions[4].label).toBe('Completed');
      expect(scope.filterOptions[4].value).toBe(floorplan.filterValues.COMPLETED);
    });

  });

  describe('(in auction seller floorplan mode)', function () {

    var floorplan;

    beforeEach(inject(function (User, Floorplan) {
      spyOn(User, 'isDealer').and.returnValue(false);
      floorplan = Floorplan;
      initController();
    }));

    registerCommonTests();

    it('should attach the auction list of filter options to the scope', function () {
      expect(angular.isArray(scope.filterOptions)).toBe(true);

      expect(scope.filterOptions[0].label).toBe('View All');
      expect(scope.filterOptions[0].value).toBe(floorplan.filterValues.ALL);

      expect(scope.filterOptions[1].label).toBe('Pending/Not Paid');
      expect(scope.filterOptions[1].value).toBe(floorplan.filterValues.PENDING_NOT_PAID);

      expect(scope.filterOptions[2].label).toBe('Denied/Not Paid');
      expect(scope.filterOptions[2].value).toBe(floorplan.filterValues.DENIED_NOT_PAID);

      expect(scope.filterOptions[3].label).toBe('Approved/Paid');
      expect(scope.filterOptions[3].value).toBe(floorplan.filterValues.APPROVED_PAID);

      expect(scope.filterOptions[4].label).toBe('Approved/Not Paid');
      expect(scope.filterOptions[4].value).toBe(floorplan.filterValues.APPROVED_NOT_PAID);

      expect(scope.filterOptions[5].label).toBe('Completed/Paid');
      expect(scope.filterOptions[5].value).toBe(floorplan.filterValues.COMPLETED_PAID);

      expect(scope.filterOptions[6].label).toBe('Completed/Not Paid');
      expect(scope.filterOptions[6].value).toBe(floorplan.filterValues.COMPLETED_NOT_PAID);
    });
  });
});
