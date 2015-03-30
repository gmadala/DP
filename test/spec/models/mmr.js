'use strict';

describe('Service: Mmr', function () {
  beforeEach(module('nextgearWebApp'));

  var Mmr,
      $httpBackend,
      success,
      failure,
      responseStub = {
        Success: true,
        Data: [
          { Id: 'thing1', Name: 'thing1' },
          { Id: 'thing2', Name: 'thing2' }
        ]
      },
      mock = {
        year: { Id: 'yr1' },
        make: { Id: 'make1' },
        model: { Id: 'model1' },
        style: { Id: 'style1' }
      };

  beforeEach(inject(function (_Mmr_, _$httpBackend_) {
    Mmr = _Mmr_;
    $httpBackend = _$httpBackend_;

    success = jasmine.createSpy('success');
    failure = jasmine.createSpy('failure');
  }));

  describe('getters', function() {
    describe('getYears', function() {
      it('should support promises', function() {
        $httpBackend.whenGET('/mmr/years/').respond(responseStub);

        expect(angular.isFunction(Mmr.getYears().then)).toBe(true);
      });
    });

    describe('getMakes', function() {
      it('should thrown an error when param(s) are missing', function() {
        expect(function() { Mmr.getMakes(); }).toThrow();
        expect(function() { Mmr.getMakes([]); }).toThrow();
        expect(function() { Mmr.getMakes(''); }).toThrow();
      });

      it('should support promises', function() {
        $httpBackend.whenGET('/mmr/makes/yr1').respond(responseStub);

        expect(angular.isFunction(Mmr.getMakes(mock.year).then)).toBe(true);
      });

      it('should return an array of make objects', function() {
        $httpBackend.whenGET('/mmr/makes/yr1').respond(responseStub);

        Mmr.getMakes(mock.year).then(function(results) {
          expect(angular.isArray(results)).toBe(true);
          expect(results[0].Id).toBe('thing1');
        });
      });
    });

    describe('getModels', function() {
      it('should thrown an error when param(s) are missing', function() {
        expect(function() { Mmr.getModels(); }).toThrow();
        expect(function() { Mmr.getModels([]); }).toThrow();
        expect(function() { Mmr.getModels(''); }).toThrow();
        expect(function() { Mmr.getModels(mock.year, []); }).toThrow();
        expect(function() { Mmr.getModels(mock.year, ''); }).toThrow();
        expect(function() { Mmr.getModels([], mock.make); }).toThrow();
        expect(function() { Mmr.getModels('', mock.make); }).toThrow();
      });

      it('should support promises', function() {
        $httpBackend.whenGET('/mmr/models/make1/yr1').respond(responseStub);

        expect(angular.isFunction(Mmr.getModels(mock.make, mock.year).then)).toBe(true);
      });

      it('should return an array of model objects', function() {
        $httpBackend.whenGET('/mmr/models/make1/yr1').respond(responseStub);

        Mmr.getModels(mock.make, mock.year).then(function(results) {
          expect(angular.isArray(results)).toBe(true);
          expect(results[0].Id).toBe('thing1');
        });
      });
    });

    describe('getBodyStyles', function() {
      it('should thrown an error when param(s) are missing', function() {
        expect(function() { Mmr.getBodyStyles(); }).toThrow();
        expect(function() { Mmr.getBodyStyles([]); }).toThrow();
        expect(function() { Mmr.getBodyStyles(''); }).toThrow();
        expect(function() { Mmr.getBodyStyles(mock.make, []); }).toThrow();
        expect(function() { Mmr.getBodyStyles(mock.make, ''); }).toThrow();
        expect(function() { Mmr.getBodyStyles([], mock.year); }).toThrow();
        expect(function() { Mmr.getBodyStyles('', mock.year); }).toThrow();
        expect(function() { Mmr.getBodyStyles(mock.make, mock.year, []); }).toThrow();
        expect(function() { Mmr.getBodyStyles(mock.make, mock.year, ''); }).toThrow();
        expect(function() { Mmr.getBodyStyles([], mock.year, mock.model); }).toThrow();
        expect(function() { Mmr.getBodyStyles('', mock.year, mock.model); }).toThrow();
        expect(function() { Mmr.getBodyStyles(mock.make, [], mock.model); }).toThrow();
        expect(function() { Mmr.getBodyStyles(mock.make, '', mock.model); }).toThrow();
      });

      it('should support promises', function() {
        $httpBackend.whenGET('/mmr/bodystyles/make1/yr1/model1').respond(responseStub);

        expect(angular.isFunction(Mmr.getBodyStyles(mock.make, mock.year, mock.model).then)).toBe(true);
      });

      it('should return an array of bodyStyle objects', function() {
        $httpBackend.whenGET('/mmr/bodystyles/make1/yr1/model1').respond(responseStub);

        Mmr.getBodyStyles(mock.make, mock.year, mock.model).then(function(results) {
          expect(angular.isArray(results)).toBe(true);
          expect(results[0].Id).toBe('thing1');
        });
      });
    });
  });

  describe('lookup functions', function() {
    var api,
        vehicleResponse;

    beforeEach(inject(function(_api_) {
      api = _api_;

      vehicleResponse = {
        "Success": true,
        "Data": [
          {
            "Mid": "201005555654358",
            "MakeId": "055",
            "Make": "Toyota",
            "ModelId": "1234",
            "Model": "Corolla",
            "YearId": "2013",
            "Year": "2013",
            "BodyId": "4358",
            "Body": "4D SEDAN LE",
            "Display": "2013 TOYOTA COROLLA 4D SEDAN LE",
            "ExcellentWholesale": 16000,
            "GoodWholesale": 8000,
            "FairWholesale": 4000,
            "AverageWholesale": 8000
          }
        ]
      };
    }));

    describe('lookupByOptions', function() {
      it('should throw an error when param(s) are missing', function() {
        expect(function() { Mmr.lookupByOptions(); }).toThrow();
        expect(function() { Mmr.lookupByOptions(mock.year); }).toThrow();
        expect(function() { Mmr.lookupByOptions(mock.make, mock.year); }).toThrow();
        expect(function() { Mmr.lookupByOptions(mock.make, mock.year, mock.model); }).toThrow();
        expect(function() { Mmr.lookupByOptions(mock.make, mock.year, mock.model, mock.style); }).toThrow();
      });

      it('should make the api request with the proper request object', function() {
        spyOn(api, 'request').andCallThrough();
        $httpBackend.whenGET('/mmr/getVehicleValueByOptions?bodyId=style1&makeId=make1&mileage=1234&modelId=model1&yearId=yr1').respond(vehicleResponse);

        Mmr.lookupByOptions(mock.year, mock.make, mock.model, mock.style, 1234).then(function(results) {
          expect(api.request.mostRecentCall.args[2]).toEqual({
            "yearId": mock.year.Id,
            "makeId": mock.make.Id,
            "modelId": mock.model.Id,
            "mileage": 1234,
            "bodyId": mock.style.Id
          });
        });

        $httpBackend.flush();
      });
    });

    describe('lookupByVin', function() {
      it('should throw an error when param(s) are missing', function() {
        expect(function() { Mmr.lookupByVin(); }).toThrow();
        expect(function() { Mmr.lookupByVin([]); }).toThrow();
        expect(function() { Mmr.lookupByVin(''); }).toThrow();
        expect(function() { Mmr.lookupByVin([], 1234); }).toThrow();
        expect(function() { Mmr.lookupByVin('', 1234); }).toThrow();
      });

      it('should make the api request without a mileage value', function() {
        $httpBackend.whenGET('/mmr/getVehicleValueByVin/someVin').respond(vehicleResponse);

        Mmr.lookupByVin('someVin').then(success, failure);
        $httpBackend.flush();
        expect(success).toHaveBeenCalled();
        expect(failure).not.toHaveBeenCalled();
      });

      it('should make the api request with a mileage value', function() {
        $httpBackend.whenGET('/mmr/getVehicleValueByVin/someVin/789').respond(vehicleResponse);

        Mmr.lookupByVin('someVin', 789).then(success, failure);
        $httpBackend.flush();
        expect(success).toHaveBeenCalled();
        expect(failure).not.toHaveBeenCalled();
      });

      it('should reject the promise if the results array is empty', function() {
        vehicleResponse.Data = [];
        $httpBackend.whenGET('/mmr/getVehicleValueByVin/someVin/789').respond(vehicleResponse);

        Mmr.lookupByVin('someVin', 789).then(success, failure);
        $httpBackend.flush();
        expect(success).not.toHaveBeenCalled();
        expect(failure).toHaveBeenCalled();
      });
    });
  });
});
