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
        $httpBackend.whenGET('/analytics/blackbook/vehicles/make?make=make').respond(response);
        expect(angular.isFunction(Blackbook.getModels('make').then)).toBe(true);
      });

      it('should format the results', function() {
        $httpBackend.whenGET('/analytics/blackbook/vehicles/make?make=make').respond(response);

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
        $httpBackend.whenGET('/analytics/blackbook/vehicles/make/model?make=make&model=model').respond(response);
        expect(angular.isFunction(Blackbook.getYears('make', 'model').then)).toBe(true);
      });

      it('should format the results', function() {
        $httpBackend.whenGET('/analytics/blackbook/vehicles/make/model?make=make&model=model').respond(response);

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
        $httpBackend.whenGET('/analytics/blackbook/vehicles/make/model/1?make=make&model=model&year=year').respond(response);
        expect(angular.isFunction(Blackbook.getStyles('make', 'model', 'year').then)).toBe(true);
      });

      it('should format the results', function() {
        $httpBackend.whenGET('/analytics/blackbook/vehicles/make/model/1?make=make&model=model&year=year').respond(response);

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

      it('should remove any results from the array that have null valuation properties if isValueLookup is true', function() {
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

        Blackbook.lookupByVin('someVin', 4567, true).then(function(result) {
          expect(result[0]).toBe(response);
        });
        $httpBackend.flush();

      });

      it('should not remove any results from the array if isValueLookup is false', function() {
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
          expect(result.length).toBe(2);
          expect(result[0]).toBe(responseWithNulls);
          expect(result[1]).toBe(response);
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
