'use strict';

describe('Controller: SalesInfoCtrl', function() {
  beforeEach(module('nextgearWebApp', 'client/login/login.template.html'));

  var
    $q,
    scope,
    carInfo,
    mmrObjects,
    blackbookObjects,
    wizardService,
    initController;

  beforeEach(inject(function(_$q_,
                             $controller,
                             $rootScope,
                             _wizardService_) {

    $q = _$q_;
    scope = $rootScope.$new();
    wizardService = _wizardService_;

    // create the mock parent scope object
    scope.$parent = {
      wizardFloor: {
        valuations: {
          mmr: null,
          blackbook: null
        },
        formParts: {
          one: false,
          two: false
        },
        data: {
          UnitVin: null,
          UnitMileage: null,
          $selectedVehicle: null
        },
        stateChangeCounterFix: function() {
          return false;
        }
      }
    };

    mmrObjects = [{
      "MakeId": "010",
      "ModelId": "5000",
      "YearId": "2015",
      "BodyId": "8000",
      "Display": "2015 FORD ESCAPE FWD 4D SUV 2.5L SE",
      "ExcellentWholesale": 15000,
      "GoodWholesale": 14500,
      "FairWholesale": 14000,
      "AverageWholesale": 14500
    }, {
      "MakeId": "010",
      "ModelId": "5001",
      "YearId": "2015",
      "BodyId": "8001",
      "Display": "2015 FORD ESCAPE FWD 4D SUV 2.5L LE",
      "ExcellentWholesale": 16000,
      "GoodWholesale": 15500,
      "FairWholesale": 15000,
      "AverageWholesale": 15500
    }];

    blackbookObjects = [{
      "RoughValue": 16000,
      "AverageValue": 18000,
      "CleanValue": 20000,
      "ExtraCleanValue": 21000,
      "GroupNumber": "7444"
    }, {
      "RoughValue": 17000,
      "AverageValue": 19000,
      "CleanValue": 21000,
      "ExtraCleanValue": 22000,
      "GroupNumber": "7445"
    }];

    spyOn(wizardService, 'getMmrValues').and.returnValue($q.when(mmrObjects));
    spyOn(wizardService, 'getBlackbookValues').and.returnValue($q.when(blackbookObjects));

    scope.form = {
      $valid: false
    };

    spyOn(scope.$parent.wizardFloor, 'stateChangeCounterFix').and.callThrough();

    initController = function() {
      carInfo = $controller('CarInfoCtrl', {
        $scope: scope
      });
    };
    initController();

  }));

  describe('valuation watchers', function() {
    it('should call mmr through wizard service on valid vin and odometer', function() {
      // fill out vin
      scope.$parent.wizardFloor.data.UnitVin = 'ABC1234567890';
      scope.$digest();
      expect(wizardService.getMmrValues).not.toHaveBeenCalled();
      wizardService.getMmrValues.calls.reset();
      // fill out mileage
      scope.$parent.wizardFloor.data.UnitMileage = 5000;
      scope.$digest();
      expect(wizardService.getMmrValues).toHaveBeenCalledWith('ABC1234567890', 5000);
      wizardService.getMmrValues.calls.reset();

      scope.$parent.wizardFloor.data.UnitVin = 'ABCDE';
      scope.$digest();
      expect(wizardService.getMmrValues).not.toHaveBeenCalled();
    });

    it('should call blackbook through wizard service on valid vin and odometer', function() {
      // fill out vin
      scope.$parent.wizardFloor.data.UnitVin = 'ABC1234567890';
      scope.$digest();
      expect(wizardService.getBlackbookValues).not.toHaveBeenCalled();
      wizardService.getBlackbookValues.calls.reset();
      // fill out mileage
      scope.$parent.wizardFloor.data.UnitMileage = 5000;
      scope.$digest();
      expect(wizardService.getBlackbookValues).toHaveBeenCalledWith('ABC1234567890', 5000);
      wizardService.getBlackbookValues.calls.reset();

      scope.$parent.wizardFloor.data.UnitVin = 'ABCDE';
      scope.$digest();
      expect(wizardService.getBlackbookValues).not.toHaveBeenCalled();
    });

    it('should assign the first mmr as selected mmr valuation', function() {
      expect(scope.$parent.wizardFloor.valuations.mmr).toEqual(null);
      // fill out vin
      scope.$parent.wizardFloor.data.UnitVin = 'ABC1234567890';
      scope.$digest();
      // fill out mileage
      scope.$parent.wizardFloor.data.UnitMileage = 5000;
      scope.$digest();
      expect(wizardService.getBlackbookValues).toHaveBeenCalledWith('ABC1234567890', 5000);
      expect(scope.$parent.wizardFloor.valuations.mmr).toEqual(mmrObjects[0]);
    });

    it('should assign the first blackbook as selected blackbook valuation', function() {
      expect(scope.$parent.wizardFloor.valuations.blackbook).toEqual(null);
      // fill out vin
      scope.$parent.wizardFloor.data.UnitVin = 'ABC1234567890';
      scope.$digest();
      // fill out mileage
      scope.$parent.wizardFloor.data.UnitMileage = 5000;
      scope.$digest();
      expect(wizardService.getBlackbookValues).toHaveBeenCalledWith('ABC1234567890', 5000);
      expect(scope.$parent.wizardFloor.valuations.blackbook).toEqual(blackbookObjects[0]);
    });

    it('should assign the selected blackbook vehicle for the blackbook valuation', function() {
      // fill out vin
      scope.$parent.wizardFloor.data.UnitVin = 'ABC1234567890';
      scope.$parent.wizardFloor.data.$selectedVehicle = {
        GroupNumber: '7445'
      };
      scope.$digest();
      // fill out mileage
      scope.$parent.wizardFloor.data.UnitMileage = 5000;
      scope.$digest();
      expect(wizardService.getBlackbookValues).toHaveBeenCalledWith('ABC1234567890', 5000);
      expect(scope.$parent.wizardFloor.valuations.blackbook).toEqual(blackbookObjects[1]);
    });
  });

});