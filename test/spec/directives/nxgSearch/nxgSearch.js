'use strict';

describe('Directive: nxgSearch', function () {
  beforeEach(module('nextgearWebApp'));

  // this directive is little more than template + controller, so just test the controller
  describe('NxgSearchCtrl', function () {

    var ctrl,
      scope,
      attrs,
      AddressesMock;

    beforeEach(inject(function ($rootScope, $controller, Addresses) {
      scope = $rootScope.$new();

      attrs = {};
      AddressesMock = {
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
              AddressId: '3',
              Line1: '22095 392nd Ave.',
              Line2: null,
              City: 'Alpena',
              State: 'SD',
              Zip: '57312',
              Phone: '6053521637',
              Fax: '6053524528',
              IsActive: true,
              IsPhysicalInventory: true,
              HasFloorplanFlooredAgainst: true,
              HasApprovedFloorplanFlooredAgainst: false,
              IsTitleReleaseAddress: false,
              IsMailingAddress: false,
              IsPostOfficeBox: false
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

      ctrl = $controller('NxgSearchCtrl', {
        $scope: scope,
        $attrs: attrs,
        Addresses: AddressesMock
      });
    }));

    it('should attach a dateRangeShown boolean to the scope, defaulting to true', function () {
      expect(scope.dateRangeShown).toBe(true);
    });

    it('should watch showDateRange attribute function, if present, to set dateRangeShown', inject(function ($controller) {
      var ret = false;
      attrs.showDateRange = 'foo';
      scope.showDateRange = function () {
        return ret;
      };
      ctrl = $controller('NxgSearchCtrl', {
        $scope: scope,
        $attrs: attrs,
        Addresses: AddressesMock
      });

      scope.$apply();
      expect(scope.dateRangeShown).toBe(false);

      ret = true;
      scope.$apply();
      expect(scope.dateRangeShown).toBe(true);
    }));

    it('should attach a dateRangeValid function to the scope', function () {
      expect(typeof scope.dateRangeValid).toBe('function');
    });

    describe('dateRangeValid function', function () {

      it('should return true if the date range is hidden', function () {
        scope.dateRangeShown = false;
        expect(scope.dateRangeValid(new Date(2013, 1, 1), new Date(2013, 0, 1))).toBe(true);
      });

      it('should return true if either or both dates are null', function () {
        expect(scope.dateRangeValid(new Date(), null)).toBe(true);
        expect(scope.dateRangeValid(null, new Date())).toBe(true);
        expect(scope.dateRangeValid(null, null)).toBe(true);
      });

      it('should return true if end date is equal to or after start date', function () {
        expect(scope.dateRangeValid(new Date(2013, 1, 1), new Date(2013, 1, 1))).toBe(true);
        expect(scope.dateRangeValid(new Date(2013, 1, 1), new Date(2013, 1, 2))).toBe(true);
      });

      it('should return false if end date is before start date', function () {
        expect(scope.dateRangeValid(new Date(2013, 1, 1), new Date(2013, 0, 1))).toBe(false);
      });

    });

    it('should attach a search function to the scope', function () {
      expect(typeof scope.search).toBe('function');
    });

    describe('search function', function () {

      it('should copy the form controller state to scope.validity', function () {
        scope.searchForm = {
          $valid: false,
          foo: 'bar',
          $error: {}
        };
        scope.search();
        expect(scope.validity.$valid).toBe(false);
        expect(scope.validity.foo).toBe('bar');
      });

      it('should not call the onSearch function if searchForm is invalid', function () {
        scope.onSearch = jasmine.createSpy('onSearch');
        scope.searchForm = {
          $valid: false,
          $error: {}
        };
        scope.search();
        expect(scope.onSearch).not.toHaveBeenCalled();
      });

      it('should call the onSearch function if searchForm is valid', function () {
        scope.onSearch = jasmine.createSpy('onSearch');
        scope.searchForm = {
          $valid: true,
          $error: {}
        };
        scope.search();
        expect(scope.onSearch).toHaveBeenCalled();
      });

    });

    it('should attach a clear function to the scope', function () {
      expect(typeof scope.clear).toBe('function');
    });

    describe('clear function', function () {
      it('should call the onClear function', function () {
        scope.onClear = jasmine.createSpy('onClear');
        scope.clear({preventDefault: angular.noop});
        expect(scope.onClear).toHaveBeenCalled();
      });

    });

  });

});
