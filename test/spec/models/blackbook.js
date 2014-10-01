'use strict';

describe('Service: Blackbook', function () {

  var dialogMock,
    dialogResult;

  // load the service's module
  // mock $dialog service (stand-in for actual business search modal)
  // that will call dialogMock.dialog for instantiation, and resolve
  // the open() promise immediately with dialogResult
  beforeEach(function () {
    module('nextgearWebApp', function($provide) {
      $provide.decorator('$dialog', function($delegate, $q) {
        dialogMock = {
          dialog: function () {
            return {
              open: function () {
                var def = $q.defer();
                def.resolve(dialogResult);
                return def.promise;
              }
            };
          }
        };

        return dialogMock;
      });
    });
  });

  // instantiate service
  var Blackbook,
      $httpBackend;

  beforeEach(inject(function (_Blackbook_, _$httpBackend_) {
    $httpBackend = _$httpBackend_;
    Blackbook = _Blackbook_;
  }));

  describe('wasUserCancelled function', function () {

    it('should return true if the provided value matches USER_CANCEL', function () {
      expect(Blackbook.wasUserCancelled('userCancel')).toBe(true);
    });

    it('should return false otherwise', function () {
      expect(Blackbook.wasUserCancelled('foo')).toBe(false);
    });

  });

  describe('fetchVehicleTypeInfoForVin function', function () {

    var httpBackend,
      failure,
      success,
      resultSkeleton = {
        Success: true,
        Message: null,
        Data: []
      };

    beforeEach(inject(function ($httpBackend) {
      failure = jasmine.createSpy('failure');
      success = jasmine.createSpy('success');
      httpBackend = $httpBackend;
    }));

    it('should throw an error if the VIN is missing', function () {
      expect(function () {
        Blackbook.fetchVehicleTypeInfoForVin();
      }).toThrow();
    });

    it('should make the expected http request without mileage', function () {
      httpBackend.expectGET('/analytics/v1_2/blackbook/SOMEVIN123').respond(resultSkeleton);
      Blackbook.fetchVehicleTypeInfoForVin('SOMEVIN123');
      httpBackend.flush();
    });

    it('should make the expected http request with mileage', function () {
      httpBackend.expectGET('/analytics/v1_2/blackbook/SOMEVIN123/123456').respond(resultSkeleton);
      Blackbook.fetchVehicleTypeInfoForVin('SOMEVIN123', '123456');
      httpBackend.flush();
    });

    it('should reject its promise if there are no results', function () {
      var result = angular.extend({}, resultSkeleton);
      result.Data = null;
      httpBackend.whenGET('/analytics/v1_2/blackbook/SOMEVIN123').respond(result);

      Blackbook.fetchVehicleTypeInfoForVin('SOMEVIN123').then(success, failure);
      httpBackend.flush();
      expect(success).not.toHaveBeenCalled();
      expect(failure).toHaveBeenCalled();
    });

    it('should reject its promise if the result list is empty', function () {
      httpBackend.whenGET('/analytics/v1_2/blackbook/SOMEVIN123').respond(resultSkeleton);

      Blackbook.fetchVehicleTypeInfoForVin('SOMEVIN123').then(success, failure);
      httpBackend.flush();
      expect(success).not.toHaveBeenCalled();
      expect(failure).toHaveBeenCalled();
    });

    it('should resolve a single result without user interaction, at any multiplesResolution setting', function () {
      var myItem = {};
      var result = angular.extend({}, resultSkeleton);
      result.Data = [myItem];
      httpBackend.whenGET('/analytics/v1_2/blackbook/SOMEVIN123').respond(result);
      spyOn(dialogMock, 'dialog');

      Blackbook.fetchVehicleTypeInfoForVin('SOMEVIN123', null, true).then(success, failure);
      httpBackend.flush();
      expect(success).toHaveBeenCalledWith(myItem);

      success = jasmine.createSpy('success');
      Blackbook.fetchVehicleTypeInfoForVin('SOMEVIN123', null, false).then(success, failure);
      httpBackend.flush();
      expect(success).toHaveBeenCalledWith(myItem);

      success = jasmine.createSpy('success');
      Blackbook.fetchVehicleTypeInfoForVin('SOMEVIN123', null, {}).then(success, failure);
      httpBackend.flush();
      expect(success).toHaveBeenCalledWith(myItem);

      expect(dialogMock.dialog).not.toHaveBeenCalled();
    });

    it('should pass through multiple results with multiplesResolution === false', function () {
      var myItems = [{}, {}];
      var result = angular.extend({}, resultSkeleton);
      result.Data = myItems;
      httpBackend.whenGET('/analytics/v1_2/blackbook/SOMEVIN123').respond(result);
      spyOn(dialogMock, 'dialog');

      Blackbook.fetchVehicleTypeInfoForVin('SOMEVIN123', null, false).then(success, failure);
      httpBackend.flush();
      expect(success).toHaveBeenCalledWith(myItems);
      expect(dialogMock.dialog).not.toHaveBeenCalled();
    });

    it('should invoke the expected dialog on multiple results with multiplesResolution === true', function () {
      var myItems = [{}, {}];
      var result = angular.extend({}, resultSkeleton);
      result.Data = myItems;
      httpBackend.whenGET('/analytics/v1_2/blackbook/SOMEVIN123').respond(result);
      spyOn(dialogMock, 'dialog').andCallThrough();

      Blackbook.fetchVehicleTypeInfoForVin('SOMEVIN123', null, true).then(success, failure);
      httpBackend.flush();
      expect(dialogMock.dialog).toHaveBeenCalled();
      expect(dialogMock.dialog.mostRecentCall.args[0].templateUrl).toBe('views/modals/multipleVehicles.html');
      expect(dialogMock.dialog.mostRecentCall.args[0].controller).toBe('MultipleVehiclesCtrl');
      expect(dialogMock.dialog.mostRecentCall.args[0].resolve.matchList()).toBe(myItems);
    });

    it('when doing interactive selection, should resolve its promise to the value from the dialog', function () {
      var uno = {},
        dos = {};
      dialogResult = dos;
      var myItems = [uno, dos];
      var result = angular.extend({}, resultSkeleton);
      result.Data = myItems;
      httpBackend.whenGET('/analytics/v1_2/blackbook/SOMEVIN123').respond(result);

      Blackbook.fetchVehicleTypeInfoForVin('SOMEVIN123', null, true).then(success, failure);
      httpBackend.flush();
      expect(success).toHaveBeenCalledWith(dos);
    });

    it('when doing interactive selection, should reject its promise if the dialog is closed w/o a choice', function () {
      dialogResult = undefined;
      var myItems = [{}, {}];
      var result = angular.extend({}, resultSkeleton);
      result.Data = myItems;
      httpBackend.whenGET('/analytics/v1_2/blackbook/SOMEVIN123').respond(result);

      Blackbook.fetchVehicleTypeInfoForVin('SOMEVIN123', null, true).then(success, failure);
      httpBackend.flush();
      expect(failure).toHaveBeenCalledWith('userCancel');
    });

    it('should automatically resolve multiples with a hint if provided', function () {
      var one = {
          Make: 'm1',
          Model: 'mm1',
          Year: 'y1',
          Style: 's1'
        },
        two = {
          Make: 'm2',
          Model: 'mm2',
          Year: 'y2',
          Style: 's2'
        },
        hint = angular.extend({}, two);
      var myItems = [one, two];
      var result = angular.extend({}, resultSkeleton);
      result.Data = myItems;
      httpBackend.whenGET('/analytics/v1_2/blackbook/SOMEVIN123').respond(result);
      spyOn(dialogMock, 'dialog');

      Blackbook.fetchVehicleTypeInfoForVin('SOMEVIN123', null, hint).then(success, failure);
      httpBackend.flush();
      expect(success).toHaveBeenCalledWith(two);
      expect(dialogMock.dialog).not.toHaveBeenCalled();
    });

    it('should fall back to manual resolution if the hint does not match anything', function () {
      var one = {
          Make: 'm1',
          Model: 'mm1',
          Year: 'y1',
          Style: 's1'
        },
        two = {
          Make: 'm2',
          Model: 'mm2',
          Year: 'y2',
          Style: 's2'
        },
        hint = {
          Make: 'm6',
          Model: 'mm2',
          Year: 'y2',
          Style: 's2'
        };
      var myItems = [one, two];
      var result = angular.extend({}, resultSkeleton);
      result.Data = myItems;
      httpBackend.whenGET('/analytics/v1_2/blackbook/SOMEVIN123').respond(result);
      spyOn(dialogMock, 'dialog').andCallThrough();

      Blackbook.fetchVehicleTypeInfoForVin('SOMEVIN123', null, hint).then(success, failure);
      httpBackend.flush();
      expect(dialogMock.dialog).toHaveBeenCalled();
    });
  });

  describe('getter functions', function() {
    var response = function() {
      return [200, {
        Success: true,
        Data: [{ "Results": ['a', 'b', 'c'] }]
      }];
    };

    describe('getMakes', function() {
      it('should support promises', function() {
        $httpBackend.whenGET('/analytics/blackbook/vehicles/').respond({});
        expect(angular.isFunction(Blackbook.getMakes().then)).toBe(true);
      });

      it('should format the results', function() {
        $httpBackend.whenGET('/analytics/blackbook/vehicles/').respond(response);

        Blackbook.getMakes().then(function(result) {
          expect(angular.isArray(result)).toBe(true);
          expect(result.length).toBe(3);
        });
        $httpBackend.flush();
      });
    });

    describe('getModels', function() {
      it('should throw an error when param(s) are missing', function() {
        expect(function() { Blackbook.getModels(); }).toThrow();
        expect(function() { Blackbook.getModels([]); }).toThrow();
        expect(function() { Blackbook.getModels(''); }).toThrow();
      });

      it('should support promises', function() {
        $httpBackend.whenGET('/analytics/blackbook/vehicles/make').respond({});
        expect(angular.isFunction(Blackbook.getModels('make').then)).toBe(true);
      });

      it('should format the results', function() {
        $httpBackend.whenGET('/analytics/blackbook/vehicles/make').respond(response);

        Blackbook.getModels('make').then(function(result) {
          expect(angular.isArray(result)).toBe(true);
          expect(result.length).toBe(3);
        });
        $httpBackend.flush();
      });
    });

    describe('getYears', function() {
      it('should throw an error when param(s) are missing', function() {
        expect(function() { Blackbook.getYears(); }).toThrow();
        expect(function() { Blackbook.getYears([]); }).toThrow();
        expect(function() { Blackbook.getYears(''); }).toThrow();
        expect(function() { Blackbook.getYears('make', []); }).toThrow();
        expect(function() { Blackbook.getYears('make', ''); }).toThrow();
      });

      it('should support promises', function() {
        $httpBackend.whenGET('/analytics/blackbook/vehicles/make/model').respond(response);
        expect(angular.isFunction(Blackbook.getYears('make', 'model').then)).toBe(true);
      });

      it('should format the results', function() {
        $httpBackend.whenGET('/analytics/blackbook/vehicles/make/model').respond(response);

        Blackbook.getYears('make', 'model').then(function(result) {
          expect(angular.isArray(result)).toBe(true);
          expect(result.length).toBe(3);
        });
        $httpBackend.flush();
      });
    });

    describe('getStyles', function() {
      it('should throw an error when param(s) are missing', function() {
        expect(function() { Blackbook.getStyles(); }).toThrow();
        expect(function() { Blackbook.getStyles([]); }).toThrow();
        expect(function() { Blackbook.getStyles(''); }).toThrow();
        expect(function() { Blackbook.getStyles('make', []); }).toThrow();
        expect(function() { Blackbook.getStyles('make', ''); }).toThrow();
        expect(function() { Blackbook.getStyles('make', 'model', []); }).toThrow();
        expect(function() { Blackbook.getStyles('make', 'model', ''); }).toThrow();
      });

      it('should support promises', function() {
        $httpBackend.whenGET('/analytics/blackbook/vehicles/make/model/year').respond(response);
        expect(angular.isFunction(Blackbook.getStyles('make', 'model', 'year').then)).toBe(true);
      });

      it('should format the results', function() {
        $httpBackend.whenGET('/analytics/blackbook/vehicles/make/model/year').respond(response);

        Blackbook.getStyles('make', 'model', 'year').then(function(result) {
          expect(angular.isArray(result)).toBe(true);
          expect(result.length).toBe(3);
        });
        $httpBackend.flush();
      });
    });
  });

  describe('lookups', function() {
    var api,
        response;

    beforeEach(inject(function(_api_) {
      api = _api_;

      response = {
        VinPos1To8: "JHMGE872",
        VinYearCode: "9",
        Make: "Honda",
        Model: "Fit",
        Style: "4D Hatchback 1.5L I-4 MPI SOHC VTEC",
        Year: 2009,
        RoughValue: 7150,
        AverageValue: 8700,
        CleanValue: 9850,
        ExtraCleanValue: 10600,
        GroupNumber: "4109",
        MakeNumber: "360",
        UVc: "140",
        DSCRegionalAveragePurchasePrice: null,
        DSCRegionalMaxPurchasePrice: null,
        DSCRegionalMinPurchasePrice: null
      };
    }));

    describe('lookupByOptions', function() {
      it('should throw an error when param(s) are missing', function() {
        expect(function() { Blackbook.lookupByOptions(); }).toThrow();
        expect(function() { Blackbook.lookupByOptions('make', null, null, null, null); }).toThrow();
        expect(function() { Blackbook.lookupByOptions('make', 'model', null, null, null); }).toThrow();
        expect(function() { Blackbook.lookupByOptions('make', 'model', 'year', null, null); }).toThrow();
        expect(function() { Blackbook.lookupByOptions('make', 'model', 'year', 'style', null); }).toThrow();
      });

      it('should make the api request if we have all the params', function() {
        $httpBackend.whenPOST('/analytics/v1_2/blackbook/vehicles').respond(function() {
          return [200, {
            Success: true,
            Data: [response]
          }];
        });

        Blackbook.lookupByOptions('make', 'model', 'year', 'style', 12345).then(function(result) {
          expect(angular.isArray(result)).toBe(true);
          expect(result[0].RoughValue).toBeDefined();
          expect(result[0].AverageValue).toBeDefined();
          expect(result[0].CleanValue).toBeDefined();
          expect(result[0].ExtraCleanValue).toBeDefined();
        });
        $httpBackend.flush();
      });
    });

    describe('lookupByVin', function() {
      var success,
          failure;

      beforeEach(function() {
        success = jasmine.createSpy('success');
        failure = jasmine.createSpy('failure');
      });

      it('should throw an error when param(s) are missing', function() {
        expect(function() { Blackbook.lookupByVin(); }).toThrow();
        expect(function() { Blackbook.lookupByVin(''); }).toThrow();
        expect(function() { Blackbook.lookupByVin('', 1234); }).toThrow();
      });

      it('should make the api request without a mileage value', function() {
        $httpBackend.whenGET('/analytics/v1_2/blackbook/someVin').respond(function() {
          return [200, {
            Success: true,
            Data: [response]
          }];
        });

        Blackbook.lookupByVin('someVin').then(function(result) {
          expect(angular.isArray(result)).toBe(true);
        });
        $httpBackend.flush();
      });

      it('should make the api request with a mileage value', function() {
        $httpBackend.whenGET('/analytics/v1_2/blackbook/someVin/4567').respond(function() {
          return [200, {
            Success: true,
            Data: [response]
          }];
        });

        Blackbook.lookupByVin('someVin', 4567).then(function(result) {
          expect(angular.isArray(result)).toBe(true);
        });
        $httpBackend.flush();
      });

      it('should remove any results from the array that have null valuation properties', function() {
        var responseWithNulls = {
          VinPos1To8: "JHMGE872",
          VinYearCode: "9",
          Make: "Honda",
          Model: "Fit",
          Style: "4D Hatchback 1.5L I-4 MPI SOHC VTEC",
          Year: 2009,
          RoughValue: null,
          AverageValue: null,
          CleanValue: null,
          ExtraCleanValue: null,
          GroupNumber: "4109",
          MakeNumber: "360",
          UVc: "140",
          DSCRegionalAveragePurchasePrice: null,
          DSCRegionalMaxPurchasePrice: null,
          DSCRegionalMinPurchasePrice: null
        };

        $httpBackend.whenGET('/analytics/v1_2/blackbook/someVin/4567').respond(function() {
          return [200, {
            Success: true,
            Data: [responseWithNulls, response]
          }];
        });

        Blackbook.lookupByVin('someVin', 4567).then(function(result) {
          expect(result[0]).toBe(response);
        });
        $httpBackend.flush();

      });

      it('should reject the promise if there are no results', function() {
        $httpBackend.whenGET('/analytics/v1_2/blackbook/someVin').respond(function() {
          return [200, {
            Success: true,
            Data: null
          }];
        });

        Blackbook.lookupByVin('someVin').then(success, failure);
        $httpBackend.flush();
        expect(success).not.toHaveBeenCalled();
        expect(failure).toHaveBeenCalled();
      });

      it('should reject the promise if there are no results', function() {
        $httpBackend.whenGET('/analytics/v1_2/blackbook/someVin').respond(function() {
          return [200, {
            Success: true,
            Data: []
          }];
        });

        Blackbook.lookupByVin('someVin').then(success, failure);
        $httpBackend.flush();
        expect(success).not.toHaveBeenCalled();
        expect(failure).toHaveBeenCalled();
      });
    });
  });
});
