'use strict';

describe('Controller: ValueLookupCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var ValueLookupCtrl,
    scope,
    $httpBackend,
    $q,
    mmr,
    blackbook,
    kbb,
    features,
    User,
    fillBlackbook,
    fillMmr,
    fillKbb,
    fillVinSearch,
    run,
    bbResult,
    mmrResult,
    kbbResult,
    configResult,
    kbbResultFormatted,
    mock;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$httpBackend_, _$q_, Blackbook, Mmr, _Kbb_, _features_, _User_) {
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    blackbook = Blackbook;
    mmr = Mmr;
    kbb = _Kbb_;
    features = _features_;
    User = _User_;
    features.kbb.enabled = true; // always enable for unit testing

    scope = $rootScope.$new();

    fillBlackbook = function() {
      scope.manualLookup.blackbook.makes.selected = 'MyMake';
      scope.manualLookup.blackbook.models.selected = 'MyModel';
      scope.manualLookup.blackbook.years.selected = 'MyYear';
      scope.manualLookup.blackbook.styles.selected = 'MyStyle';
      scope.manualLookup.blackbook.mileage = 1234;
    };

    fillMmr = function() {
      scope.manualLookup.mmr.years.selected = 'aYear';
      scope.manualLookup.mmr.makes.selected = 'aMake';
      scope.manualLookup.mmr.models.selected = 'aModel';
      scope.manualLookup.mmr.styles.selected = 'aStyle';
      scope.manualLookup.mmr.mileage = 789;
    };

    fillKbb = function() {
      scope.manualLookup.kbb.years.selected = { Key: 2012, Value: '2012' };
      scope.manualLookup.kbb.makes.selected = { Key: 1, Value: 'aMake' };
      scope.manualLookup.kbb.models.selected = { Key: 2, Value: 'aModel' };
      scope.manualLookup.kbb.styles.selected = { VehicleId: 2, DisplayName: 'aStyle' };
      scope.manualLookup.kbb.mileage = 789;
      scope.manualLookup.kbb.zipcode = 12345;
    };

    mock = {
      bb: {
        makes: { Success: true, Data: [{ Results: [ 'Toyota', 'Ford' ] }]},
        models: { Success: true, Data: [{ Results: [ 'Corolla', 'Camry' ] }]},
        years: { Success: true, Data: [{ Results: [ 2010, 2012 ] }]},
        styles: { Success: true, Data: [{ Results: [ '4D Sedan', '2D Coupe' ] }]}
      },
      mmr: {
        makes: { Success: true, Data: [{ Id: 'id', Name: 'Toyota' }, { Id: 'id', Name: 'Ford' }]},
        models: { Success: true, Data: [{ Id: 'id', Name: 'Corolla' }, { Id: 'id', Name: 'Camry' }]},
        years: { Success: true, Data: [{ Id: 'id', Name: 2012 }, { Id: 'id', Name: 2014 }]},
        styles: { Success: true, Data: [{ Id: 'id', Name: '4D Sedan' }, { Id: 'id', Name:  '2D Coupe' }]}
      },
      kbb: {
        makes: { Success: true, Data: [{ Key: 1, Value: 'Toyota' }, { Key: 2, Value: 'Ford' }]},
        models: { Success: true, Data: [{ Key: 123, Value: 'Corolla' }, { Key: 124, Value: 'Camry' }]},
        years: { Success: true, Data: [{ Key: 2012, Value: '2012' }, { Key: 2014, Value: '2014' }]},
        styles: { Success: true, Data: [{ VehicleId: 123, DisplayName: '4D Sedan' }, { VehicleId: 124, DisplayName:  '2D Coupe' }]}
      }
    };

    fillVinSearch = function() {
      scope.vinLookup.vin = 'someVin1234';
      scope.vinLookup.mileage = 8888;
      scope.vinLookup.zipcode = 12345;
    };

    mmrResult = {
      Success: true,
      Data: [{
        Year: 2009,
        Make: 'Toyota',
        Model: 'Corolla',
        Body: '4D Sedan',
        FairWholesale: 12000,
        AverageWholesale: 13000,
        GoodWholesale: 14000,
        ExcellentWholesale: 15000
      }]
    };

    bbResult = {
      Success: true,
      Data: [{
        Year: 2009,
        Make: 'Toyota',
        Model: 'Corolla',
        Style: '4D Sedan',
        RoughValue: 10000,
        AverageValue: 11000,
        CleanValue: 12000,
        ExtraCleanValue: 13000
      }]
    };

    configResult = {
      'Success': true,
      'Message': null,
      'Data': [
        {
          'Id': '6146',
          'VIN': '1234567890',
          'Year': {
            'Id': '1998',
            'Value': '1998'
          },
          'Make': {
            'Id': '2',
            'Value': 'Acura'
          },
          'Model': {
            'Id': '318',
            'Value': 'CL'
          },
          'Trim': {
            'Id': '273304',
            'Value': '2.3 Coupe 2D'
          }
        }
      ]
    };

    kbbResult = {
      'Success': true,
      'Data': {
        'ValuationZipCode': '46303',
        'ValuationPrices': [
          {
            'PriceType': 14,
            'Value': 26376
          },
          {
            'PriceType': 17,
            'Value': 22929
          },
          {
            'PriceType': 16,
            'Value': 24926
          },
          {
            'PriceType': 15,
            'Value': 25815
          }
        ]
      }
    };

    kbbResultFormatted = [
        {
          14: 26376,
          15: 25815,
          16: 24926,
          17: 22929
        }
      ];

    run = function() {
      ValueLookupCtrl = $controller('ValueLookupCtrl', {
        $scope: scope,
        Blackbook: blackbook,
        Mmr: mmr,
        Kbb: kbb
      });

      scope.vinLookupForm = {
        $valid: true
      };

      scope.manualLookupForm = {
        $valid: true
      };
    };
  }));

  describe('utility functions', function() {
    beforeEach(function() {
      $httpBackend.whenGET('/analytics/blackbook/vehicles/').respond({});
      $httpBackend.whenGET('/mmr/years/').respond({});
      $httpBackend.whenGET('/kbb/vehicle/getyears/UsedCar/Dealer').respond({});
      run();
    });

    describe('hideMmrAll', function() {
      it('should return false if we have not run a search yet', function() {
        expect(scope.hideMmrAll()).toBe(false);
      });

      it('should return false if we ran a vin search', function() {
        scope.vinLookup.searchComplete = true;
        expect(scope.hideMmrAll()).toBe(false);
      });

      it('should return false if we ran a manual mmr search', function() {
        scope.manualLookup.searchComplete = true;
        scope.results.mmr.data = ['a'];
        expect(scope.hideMmrAll()).toBe(false);
      });

      it('should return true if we ran a manual blackbook search', function() {
        scope.manualLookup.searchComplete = true;
        scope.results.mmr.data = null;
        scope.results.mmr.noMatch = false;
        expect(scope.hideMmrAll()).toBe(true);
      });
    });

    describe('hideBlackbookAll', function() {
      it('should return false if we have not run a search yet', function() {
        expect(scope.hideBlackbookAll()).toBe(false);
      });

      it('should return false if we ran a vin search', function() {
        scope.vinLookup.searchComplete = true;
        expect(scope.hideBlackbookAll()).toBe(false);
      });

      it('should return false if we ran a manual blackbook search', function() {
        scope.manualLookup.searchComplete = true;
        scope.results.blackbook.data = ['a'];
        expect(scope.hideBlackbookAll()).toBe(false);
      });

      it('should return true if we ran a manual mmr search', function() {
        scope.manualLookup.searchComplete = true;
        scope.results.blackbook.data = null;
        scope.results.blackbook.noMatch = false;
        expect(scope.hideBlackbookAll()).toBe(true);
      });
    });

    describe('showMultiplesWarning', function(){
      it('should return false if we have not yet run a search', function() {
        expect(scope.showMultiplesWarning()).toBe(false);
      });

      it('should return true if we get multiple blackbook matches and only one mmr match', function() {
        scope.results.blackbook.multiple = ['a', 'b'];
        scope.results.mmr.multiple = null;
        expect(scope.showMultiplesWarning()).toBe(true);
      });

      it('should return true if we get multiple mmr matches and only one blackbook match', function() {
        scope.results.mmr.multiple = ['a', 'b'];
        scope.results.blackbook.multiple = null;
        expect(scope.showMultiplesWarning()).toBe(true);
      });
    });

    describe('showDescription', function() {
      it('should return true if we completed a search and have at least one matching result set (blackbook or mmr)', function() {
        scope.results.mmr.data = ['a'];
        scope.vinLookup.searchComplete = true;
        expect(scope.showDescription()).toBe(true);
      });

      it('should return false if we have not run a search yet', function() {
        expect(scope.showDescription()).toBe(false);
      });

      it('should return false if we have no match for blackbook or mmr', function() {
        scope.results.mmr.data = null;
        scope.results.blackbook.data = null;
        scope.results.kbb.data = null;
        scope.results.mmr.noMatch = true;
        scope.results.blackbook.noMatch = true;
        scope.results.kbb.noMatch = true;
        scope.vinLookup.searchComplete = true;
        expect(scope.showDescription()).toBe(false);
      });
    });
  });

  describe('KBB is only shown for UnitedStates user', function() {

    beforeEach(function() {
      $httpBackend.whenGET('/analytics/blackbook/vehicles/').respond({});
      $httpBackend.whenGET('/mmr/years/').respond({});
    });

    describe('non US user suite', function() {

      beforeEach(function() {
        spyOn(User, 'isUnitedStates').andReturn(false);
        run();
      });

      it('should not include KBB as a drop down', function () {
        expect(scope.manualLookupValues.length).toBe(3);
      });

      describe('hideKbbAll', function() {
        it('should return true if we have not run a search yet', function() {
          expect(scope.hideKbbAll()).toBe(true);
        });

        it('should return true if we ran a vin search', function() {
          scope.vinLookup.searchComplete = true;
          expect(scope.hideKbbAll()).toBe(true);
        });

        it('should return true if we ran a manual kbb search', function() {
          scope.manualLookup.searchComplete = true;
          scope.results.kbb.data = ['a'];
          expect(scope.hideKbbAll()).toBe(true);
        });

        it('should return true if we ran a different manual search', function() {
          scope.manualLookup.searchComplete = true;
          scope.results.kbb.data = null;
          scope.results.kbb.noMatch = false;
          expect(scope.hideKbbAll()).toBe(true);
        });
      });
    });

    describe('US user suite', function() {

      beforeEach(function() {
        $httpBackend.whenGET('/kbb/vehicle/getyears/UsedCar/Dealer').respond({});
        spyOn(User, 'isUnitedStates').andReturn(true);
        run();
      });

      it('should include KBB as a drop down for a UnitedStates User', function () {
        expect(scope.manualLookupValues.length).toBe(4);
      });

      describe('hideKbbAll', function() {
        it('should return false if we have not run a search yet', function() {
          expect(scope.hideKbbAll()).toBe(false);
        });

        it('should return false if we ran a vin search', function() {
          scope.vinLookup.searchComplete = true;
          expect(scope.hideKbbAll()).toBe(false);
        });

        it('should return false if we ran a manual kbb search', function() {
          scope.manualLookup.searchComplete = true;
          scope.results.kbb.data = ['a'];
          expect(scope.hideKbbAll()).toBe(false);
        });

        it('should return true if we ran a different manual search', function() {
          scope.manualLookup.searchComplete = true;
          scope.results.kbb.data = null;
          scope.results.kbb.noMatch = false;
          expect(scope.hideKbbAll()).toBe(true);
        });
      });
    });
  });

  describe('vin lookup', function() {
    beforeEach(function() {
      $httpBackend.whenGET('/analytics/blackbook/vehicles/').respond({});
      $httpBackend.whenGET('/mmr/years/').respond({});
      $httpBackend.whenGET('/kbb/vehicle/getyears/UsedCar/Dealer').respond({});
      spyOn(User, 'isUnitedStates').andReturn(true);
      run();
    });

    it('should have a reset function that clears/resets all the search properties', function() {
      expect(typeof scope.vinLookup.resetSearch).toBe('function');
      scope.vinLookup.vin = 'someVin';
      scope.vinLookup.mileage = 2345;
      scope.vinLookup.zipcode = 12345;
      scope.results.blackbook.data = ['a', 'b'];
      scope.results.mmr.data = ['c', 'd'];
      scope.results.kbb.data = ['e', 'f'];
      scope.results.description = 'foo';
      scope.vinLookup.searchComplete = true;
      scope.vinLookup.resetSearch();
      expect(scope.vinLookup.vin).toBe(null);
      expect(scope.vinLookup.mileage).toBe(null);
      expect(scope.vinLookup.zipcode).toBe(null);
      expect(scope.results.blackbook.data).toBe(null);
      expect(scope.results.mmr.data).toBe(null);
      expect(scope.results.kbb.data).toBe(null);
      expect(scope.results.description).toBe(null);
      expect(scope.vinLookup.searchComplete).toBe(false);
    });

    describe('lookup function', function() {
      beforeEach(function() {
        $httpBackend.whenGET('/analytics/v1_2/blackbook/someVin1234/8888').respond(bbResult);
        $httpBackend.whenGET('/mmr/getVehicleValueByVin/someVin1234/8888').respond(mmrResult);
        $httpBackend.whenGET('/kbb/vin/getvehicleconfigurationbyvinandclass/UsedCar/someVin1234/12345').respond(configResult);
        $httpBackend.whenGET('/kbb/value/getvehiclevaluesallconditions/UsedCar/Dealer/6146/8888/12345').respond(kbbResult);
        spyOn(blackbook, 'lookupByVin').andCallThrough();
        spyOn(mmr, 'lookupByVin').andCallThrough();
        spyOn(kbb, 'getConfigurations').andCallThrough();
        spyOn(kbb, 'lookupByConfiguration').andCallThrough();

        fillVinSearch();
      });

      it('should reset the opposite search', function() {
        spyOn(scope.manualLookup, 'resetSearch');
        scope.vinLookup.lookup();
        expect(scope.manualLookup.resetSearch).toHaveBeenCalled();
      });

      it('should run the validate function before doing anything', function() {
        spyOn(scope.vinLookup, 'validate');
        scope.vinLookup.lookup();
        expect(scope.vinLookup.validate).toHaveBeenCalled();
      });

      it('should do nothing if the form is not valid', function() {
        scope.vinLookupForm.$valid = false;
        scope.vinLookup.lookup();
        expect(blackbook.lookupByVin).not.toHaveBeenCalled();
        expect(mmr.lookupByVin).not.toHaveBeenCalled();
        expect(kbb.lookupByConfiguration).not.toHaveBeenCalled();
      });

      it('should call mmr and blackbook but not KBB if ZIP code is missing', function() {
        scope.vinLookup.zipcode = null;
        scope.vinLookup.lookup();
        expect(blackbook.lookupByVin).toHaveBeenCalled();
        expect(mmr.lookupByVin).toHaveBeenCalled();
        expect(kbb.lookupByConfiguration).not.toHaveBeenCalled();
      });

      it('should look up the blackbook values', function() {
        scope.vinLookup.lookup();
        expect(blackbook.lookupByVin).toHaveBeenCalledWith('someVin1234', 8888, true);
        $httpBackend.flush();
        expect(scope.results.blackbook.data).toBe(bbResult.Data[0]);
        expect(scope.results.blackbook.noMatch).toBe(false);
        expect(scope.results.blackbook.multiple).toBeFalsy();
        expect(scope.results.vin).toBe('someVin1234');
        expect(scope.results.mileage).toBe(8888);

        expect(scope.results.description).toBe(bbResult.Data[0].Year + ' ' + bbResult.Data[0].Make);
      });

      it('should handle no blackbook matches', function() {
        bbResult.Data = [];
        scope.vinLookup.lookup();
        $httpBackend.flush();
        expect(scope.results.blackbook.data).toBe(null);
        expect(scope.results.blackbook.noMatch).toBe(true);
      });

      it('should handle multiple blackbook matches', function() {
        bbResult.Data.push({
          Year: 2009,
          Make: 'Toyota',
          Model: 'Corolla',
          Style: 'another style',
          RoughValue: 10000,
          AverageValue: 11000,
          CleanValue: 12000,
          ExtraCleanValue: 13000
        });
        scope.vinLookup.lookup();
        $httpBackend.flush();
        expect(scope.results.blackbook.multiple).toBeTruthy();
        expect(scope.results.blackbook.multiple.length).toBe(2);
        expect(scope.results.blackbook.noMatch).toBe(false);
        expect(scope.results.blackbook.data).toBe(scope.results.blackbook.multiple[0]);
      });

      it('should look up the mmr values', function() {
        scope.vinLookup.lookup();
        expect(mmr.lookupByVin).toHaveBeenCalledWith('someVin1234', 8888);
        $httpBackend.flush();
        expect(scope.results.mmr.data).toBe(mmrResult.Data[0]);
        expect(scope.results.mmr.noMatch).toBe(false);
        expect(scope.results.mmr.multiple).toBeFalsy();
        expect(scope.results.vin).toBe('someVin1234');
        expect(scope.results.mileage).toBe(8888);
      });

      it('should handle no mmr matches', function() {
        mmrResult.Data = [];
        scope.vinLookup.lookup();
        $httpBackend.flush();
        expect(scope.results.mmr.data).toBe(null);
        expect(scope.results.mmr.noMatch).toBe(true);
      });

      it('should handle multiple mmr matches', function() {
        mmrResult.Data.push({
          Year: 2009,
          Make: 'Toyota',
          Model: 'Corolla',
          Body: 'style 2',
          FairWholesale: 12000,
          AverageWholesale: 13000,
          GoodWholesale: 14000,
          ExcellentWholesale: 15000
        });

        scope.vinLookup.lookup();
        $httpBackend.flush();
        expect(scope.results.mmr.multiple).toBeTruthy();
        expect(scope.results.mmr.multiple.length).toBe(2);
        expect(scope.results.mmr.noMatch).toBe(false);
        expect(scope.results.mmr.data).toBe(scope.results.mmr.multiple[0]);
      });

      it('should look up the kbb values', function() {
        scope.vinLookup.lookup();
        $httpBackend.flush();
        expect(kbb.getConfigurations).toHaveBeenCalledWith('someVin1234', 12345);
        expect(kbb.lookupByConfiguration).toHaveBeenCalledWith(configResult.Data[0], 8888, 12345);
        expect(scope.results.kbb.data).toEqual(kbbResultFormatted[0]);
        expect(scope.results.kbb.noMatch).toBe(false);
        expect(scope.results.kbb.multiple).toBeFalsy();
        expect(scope.results.vin).toBe('someVin1234');
        expect(scope.results.mileage).toBe(8888);
        expect(scope.results.zipcode).toBe(12345);
      });

      it('should handle no kbb matches', function() {
        kbbResult.Data = {};
        scope.vinLookup.lookup();
        $httpBackend.flush();
        expect(scope.results.kbb.data).toBe(null);
        expect(scope.results.kbb.noMatch).toBe(true);
      });

      it('should handle multiple kbb matches', function() {
        // TODO should it?
        expect(true).toBeTruthy();
      });
    });
  });

  describe('manual lookup', function() {
    beforeEach(function() {
      $httpBackend.whenGET('/analytics/blackbook/vehicles/').respond(mock.bb.makes);
      $httpBackend.whenGET('/mmr/years/').respond(mock.mmr.years);
      $httpBackend.whenGET('/kbb/vehicle/getyears/UsedCar/Dealer').respond(mock.kbb.years);
      spyOn(blackbook, 'getMakes').andCallThrough();
      spyOn(mmr, 'getYears').andCallThrough();
      spyOn(kbb, 'getYears').andCallThrough();
      spyOn(User, 'isUnitedStates').andReturn(true);
      run();
    });

    it('should have a lookup up function to call the appropriate model\'s lookupByOptions function', function() {
      var nextGear = scope.manualLookupValues[1].id;
      var mmrValue = scope.manualLookupValues[2].id;
      var kbbValue = scope.manualLookupValues[3].id;

      expect(nextGear).toBe('bb');
      spyOn(scope.manualLookup.blackbook, 'lookup').andReturn({});
      if(scope.lookupValues.id === 'bb') {
        scope.manualLookup.lookup();
        expect(scope.manualLookup.blackbook.lookup).toHaveBeenCalled();
      }

      expect(mmrValue).toBe('mmr');
      spyOn(scope.manualLookup.mmr, 'lookup').andReturn({});
      if(scope.lookupValues.id === 'mmr') {
        scope.manualLookup.lookup();
        expect(scope.manualLookup.mmr.lookup).toHaveBeenCalled();
      }

      expect(kbbValue).toBe('kbb');
      spyOn(scope.manualLookup.kbb, 'lookup').andReturn({});
      if (scope.lookupValues.id === 'kbb') {
        scope.manualLookup.lookup();
      }
    });

    describe('blackbook functionality', function() {
      it('should populate the makes dropdown on load', function() {
        $httpBackend.flush();
        expect(blackbook.getMakes).toHaveBeenCalled();
        expect(scope.manualLookup.blackbook.makes.list.length).toBe(2);
      });

      it('should populate the models dropdown when a make is chosen', function() {
        spyOn(blackbook, 'getModels').andCallThrough();
        $httpBackend.whenGET('/analytics/blackbook/vehicles/make?make=Toyota').respond(mock.bb.models);
        scope.manualLookup.blackbook.makes.selected = 'Toyota';
        scope.manualLookup.blackbook.models.fill();
        $httpBackend.flush();
        expect(blackbook.getModels).toHaveBeenCalledWith('Toyota');
        expect(scope.manualLookup.blackbook.models.list.length).toBe(2);
      });

      it('should populate the years dropdown when a model is chosen', function() {
        spyOn(blackbook, 'getYears').andCallThrough();
        $httpBackend.whenGET('/analytics/blackbook/vehicles/make/model?make=Toyota&model=Camry').respond(mock.bb.years);
        scope.manualLookup.blackbook.makes.selected = 'Toyota';
        scope.manualLookup.blackbook.models.selected = 'Camry';
        scope.manualLookup.blackbook.years.fill();
        $httpBackend.flush();
        expect(blackbook.getYears).toHaveBeenCalledWith('Toyota', 'Camry');
        expect(scope.manualLookup.blackbook.years.list.length).toBe(2);
      });

      it('should populate the styles dropdown when a year is chosen', function() {
        spyOn(blackbook, 'getStyles').andCallThrough();
        $httpBackend.whenGET('/analytics/blackbook/vehicles/make/model/1?make=Toyota&model=Camry&year=2014').respond(mock.bb.styles);
        scope.manualLookup.blackbook.makes.selected = 'Toyota';
        scope.manualLookup.blackbook.models.selected = 'Camry';
        scope.manualLookup.blackbook.years.selected = 2014;
        scope.manualLookup.blackbook.styles.fill();
        $httpBackend.flush();
        expect(blackbook.getStyles).toHaveBeenCalledWith('Toyota', 'Camry', 2014);
        expect(scope.manualLookup.blackbook.styles.list.length).toBe(2);
      });

      it('should prevent any fill function from being called if the previous dropdowns do not have selected choices', function() {
        spyOn(blackbook, 'getModels').andCallThrough();
        spyOn(blackbook, 'getYears').andCallThrough();
        spyOn(blackbook, 'getStyles').andCallThrough();

        scope.manualLookup.blackbook.models.fill();
        expect(blackbook.getModels).not.toHaveBeenCalled();

        scope.manualLookup.blackbook.makes.selected = 'Ford';
        scope.manualLookup.blackbook.years.fill();
        expect(blackbook.getYears).not.toHaveBeenCalled();

        scope.manualLookup.blackbook.models.selected = 'Focus';
        scope.manualLookup.blackbook.styles.fill();
        expect(blackbook.getStyles).not.toHaveBeenCalled();
      });

      it('should auto-select the first model if only one is returned', function() {
        $httpBackend.whenGET('/analytics/blackbook/vehicles/make?make=Toyota').respond(mock.bb.models);

        mock.bb.models.Data[0].Results.splice(1,1);
        scope.manualLookup.blackbook.makes.selected = 'Toyota';
        spyOn(scope.manualLookup.blackbook.years, 'fill').andReturn({});
        scope.manualLookup.blackbook.models.fill();
        $httpBackend.flush();
        expect(scope.manualLookup.blackbook.models.selected).toBe(mock.bb.models.Data[0].Results[0]);
      });

      it('should auto-select the first year if only one is returned', function() {
        $httpBackend.whenGET('/analytics/blackbook/vehicles/make?make=Toyota').respond(mock.bb.models);
        $httpBackend.whenGET('/analytics/blackbook/vehicles/make/model?make=Toyota&model=Corolla').respond(mock.bb.years);

        mock.bb.years.Data[0].Results.splice(1,1);

        scope.manualLookup.blackbook.makes.selected = 'Toyota';
        scope.manualLookup.blackbook.models.selected = 'Corolla';
        spyOn(scope.manualLookup.blackbook.styles, 'fill').andReturn({});

        scope.manualLookup.blackbook.years.fill();
        $httpBackend.flush();
        expect(scope.manualLookup.blackbook.years.selected).toBe(mock.bb.years.Data[0].Results[0]);
      });

      it('should auto-select the first style if only one is returned', function() {
        $httpBackend.whenGET('/analytics/blackbook/vehicles/make/model/1?make=Toyota&model=Corolla&year=2014').respond(mock.bb.styles);

        mock.bb.styles.Data[0].Results.splice(1,1);
        scope.manualLookup.blackbook.makes.selected = 'Toyota';
        scope.manualLookup.blackbook.models.selected = 'Corolla';
        scope.manualLookup.blackbook.years.selected = 2014;
        scope.manualLookup.blackbook.styles.fill();
        $httpBackend.flush();
        expect(scope.manualLookup.blackbook.styles.selected).toBe(mock.bb.styles.Data[0].Results[0]);
      });

      describe('lookup', function() {
        beforeEach(function() {
          spyOn(blackbook, 'lookupByOptions').andCallThrough();
          $httpBackend.whenPOST('/analytics/v1_2/blackbook/vehicles').respond(bbResult);
          run();
          fillBlackbook();
        });

        it('should reset the opposite search', function() {
          spyOn(scope.vinLookup, 'resetSearch');
          scope.manualLookup.blackbook.lookup();
          expect(scope.vinLookup.resetSearch).toHaveBeenCalled();
        });

        it('should run the validate function before doing anything', function() {
          spyOn(scope.manualLookup.blackbook, 'validate');
          scope.manualLookup.blackbook.lookup();
          expect(scope.manualLookup.blackbook.validate).toHaveBeenCalled();
        });

        it('should do nothing if the form is not valid', function() {
          scope.manualLookupForm.$valid = false;
          scope.manualLookup.blackbook.lookup();
          expect(blackbook.lookupByOptions).not.toHaveBeenCalled();
        });

        it('should look up the blackbook values', function() {
          scope.manualLookup.blackbook.lookup();
          expect(blackbook.lookupByOptions).toHaveBeenCalled();
          $httpBackend.flush();
          expect(scope.results.blackbook.data).toBe(bbResult.Data[0]);
          expect(scope.results.blackbook.noMatch).toBe(false);
          expect(scope.results.blackbook.multiple).toBeFalsy();
          expect(scope.results.vin).toBe(null);
          expect(scope.results.mileage).toBe(1234);

          expect(scope.results.description).toBe(bbResult.Data[0].Year + ' ' + bbResult.Data[0].Make + ' ' + bbResult.Data[0].Model);
        });

        it('should handle no blackbook matches', function() {
          bbResult.Data = [];
          scope.manualLookup.blackbook.lookup();
          $httpBackend.flush();
          expect(scope.results.blackbook.data).toBe(null);
          expect(scope.results.blackbook.noMatch).toBe(true);
        });
      });
    });

    describe('mmr functionality', function() {
      it('should populate the years dropdown on load', function() {
        $httpBackend.flush();
        expect(mmr.getYears).toHaveBeenCalled();
        expect(scope.manualLookup.mmr.years.list.length).toBe(2);
      });

      it('should populate the makes dropdown when a year is chosen', function() {
        spyOn(mmr, 'getMakes').andCallThrough();
        $httpBackend.whenGET('/mmr/makes/id').respond(mock.mmr.makes);
        scope.manualLookup.mmr.years.selected = mock.mmr.years.Data[0];
        scope.manualLookup.mmr.makes.fill();
        $httpBackend.flush();
        expect(mmr.getMakes).toHaveBeenCalledWith(mock.mmr.years.Data[0]);
        expect(scope.manualLookup.mmr.makes.list.length).toBe(2);
      });

      it('should populate the models dropdown when a make is chosen', function() {
        spyOn(mmr, 'getModels').andCallThrough();
        $httpBackend.whenGET('/mmr/models/id/id').respond(mock.mmr.models);
        scope.manualLookup.mmr.years.selected = mock.mmr.years.Data[0];
        scope.manualLookup.mmr.makes.selected = mock.mmr.makes.Data[0];
        scope.manualLookup.mmr.models.fill();
        $httpBackend.flush();
        expect(mmr.getModels).toHaveBeenCalledWith(mock.mmr.makes.Data[0], mock.mmr.years.Data[0]);
        expect(scope.manualLookup.mmr.models.list.length).toBe(2);
      });

      it('should populate the styles dropdown when a model is chosen', function() {
        spyOn(mmr, 'getBodyStyles').andCallThrough();
        $httpBackend.whenGET('/mmr/bodystyles/id/id/id').respond(mock.mmr.styles);
        scope.manualLookup.mmr.years.selected = mock.mmr.years.Data[0];
        scope.manualLookup.mmr.makes.selected = mock.mmr.makes.Data[0];
        scope.manualLookup.mmr.models.selected = mock.mmr.models.Data[0];
        scope.manualLookup.mmr.styles.fill();
        $httpBackend.flush();
        expect(mmr.getBodyStyles).toHaveBeenCalledWith(mock.mmr.makes.Data[0], mock.mmr.years.Data[0], mock.mmr.models.Data[0]);
        expect(scope.manualLookup.mmr.styles.list.length).toBe(2);
      });

      it('should prevent any fill function from being called if the previous dropdowns do not have selected choices', function() {
        spyOn(mmr, 'getMakes').andCallThrough();
        spyOn(mmr, 'getModels').andCallThrough();
        spyOn(mmr, 'getBodyStyles').andCallThrough();

        scope.manualLookup.mmr.makes.fill();
        expect(mmr.getMakes).not.toHaveBeenCalled();

        scope.manualLookup.mmr.years.selected = { Id: 'id', Name: 2013 };
        scope.manualLookup.mmr.models.fill();
        expect(mmr.getModels).not.toHaveBeenCalled();

        scope.manualLookup.mmr.makes.selected = 'Focus';
        scope.manualLookup.mmr.styles.fill();
        expect(mmr.getBodyStyles).not.toHaveBeenCalled();
      });

      it('should auto-select the first make if only one is returned', function() {
        $httpBackend.whenGET('/mmr/makes/id').respond(mock.mmr.makes);

        mock.mmr.makes.Data.splice(1,1);
        scope.manualLookup.mmr.years.selected = mock.mmr.years.Data[0];
        spyOn(scope.manualLookup.mmr.models, 'fill').andReturn({});
        scope.manualLookup.mmr.makes.fill();
        $httpBackend.flush();
        expect(scope.manualLookup.mmr.makes.selected).toBe(mock.mmr.makes.Data[0]);
      });

      it('should auto-select the first model if only one is returned', function() {
        $httpBackend.whenGET('/mmr/models/id/id').respond(mock.mmr.models);

        mock.mmr.models.Data.splice(1,1);
        scope.manualLookup.mmr.years.selected = mock.mmr.years.Data[0];
        scope.manualLookup.mmr.makes.selected = mock.mmr.makes.Data[0];
        spyOn(scope.manualLookup.mmr.styles, 'fill').andReturn({});
        scope.manualLookup.mmr.models.fill();
        $httpBackend.flush();
        expect(scope.manualLookup.mmr.models.selected).toBe(mock.mmr.models.Data[0]);
      });

      it('should auto-select the first style if only one is returned', function() {
        $httpBackend.whenGET('/mmr/bodystyles/id/id/id').respond(mock.mmr.styles);

        mock.mmr.styles.Data.splice(1,1);
        scope.manualLookup.mmr.years.selected = mock.mmr.years.Data[0];
        scope.manualLookup.mmr.makes.selected = mock.mmr.makes.Data[0];
        scope.manualLookup.mmr.models.selected = mock.mmr.models.Data[0];
        scope.manualLookup.mmr.styles.fill();
        $httpBackend.flush();
        expect(scope.manualLookup.mmr.styles.selected).toBe(mock.mmr.styles.Data[0]);
      });

      describe('lookup', function() {
        beforeEach(function() {
          spyOn(mmr, 'lookupByOptions').andCallThrough();
          $httpBackend.whenGET('/mmr/getVehicleValueByOptions?mileage=789').respond(mmrResult);
          run();
          fillMmr();
        });

        it('should reset the opposite search', function() {
          spyOn(scope.vinLookup, 'resetSearch');
          scope.manualLookup.mmr.lookup();
          expect(scope.vinLookup.resetSearch).toHaveBeenCalled();
        });

        it('should run the validate function before doing anything', function() {
          spyOn(scope.manualLookup.mmr, 'validate');
          scope.manualLookup.mmr.lookup();
          expect(scope.manualLookup.mmr.validate).toHaveBeenCalled();
        });

        it('should do nothing if the form is not valid', function() {
          scope.manualLookupForm.$valid = false;
          scope.manualLookup.mmr.lookup();
          expect(mmr.lookupByOptions).not.toHaveBeenCalled();
        });

        it('should look up the mmr values', function() {
          scope.manualLookup.mmr.lookup();
          expect(mmr.lookupByOptions).toHaveBeenCalled();
          $httpBackend.flush();
          expect(scope.results.mmr.data).toBe(mmrResult.Data[0]);
          expect(scope.results.mmr.noMatch).toBe(false);
          expect(scope.results.mmr.multiple).toBeFalsy();
          expect(scope.results.mileage).toBe(789);

          // expect(scope.results.description).toBe(mmrResult.Data[0].Year + ' ' + mmrResult.Data[0].Make + ' ' + mmrResult.Data[0].Model);
        });

        it('should handle no mmr matches', function() {
          mmrResult.Data = [];
          scope.manualLookup.mmr.lookup();
          $httpBackend.flush();
          expect(scope.results.mmr.data).toBe(null);
          expect(scope.results.mmr.noMatch).toBe(true);
        });
      });
    });

    describe('kbb functionality', function() {
      it('should populate the years dropdown on load', function() {
        $httpBackend.flush();
        expect(kbb.getYears).toHaveBeenCalled();
        expect(scope.manualLookup.kbb.years.list.length).toBe(2);
      });

      it('should populate the makes dropdown when a year is chosen', function() {
        spyOn(kbb, 'getMakes').andCallThrough();
        var year = mock.kbb.years.Data[0];
        $httpBackend.whenGET('/kbb/vehicle/getmakesbyyear/UsedCar/Dealer/2012').respond(mock.kbb.makes);
        scope.manualLookup.kbb.years.selected = year;
        scope.manualLookup.kbb.makes.fill();
        $httpBackend.flush();
        expect(kbb.getMakes).toHaveBeenCalledWith(year);
        expect(scope.manualLookup.kbb.makes.list.length).toBe(2);
      });

      it('should populate the models dropdown when a make is chosen', function() {
        spyOn(kbb, 'getModels').andCallThrough();
        $httpBackend.whenGET('/kbb/vehicle/getmodelsbyyearandmake/UsedCar/Dealer/1/2012').respond(mock.kbb.models);
        scope.manualLookup.kbb.years.selected = mock.kbb.years.Data[0];
        scope.manualLookup.kbb.makes.selected = mock.kbb.makes.Data[0];
        scope.manualLookup.kbb.models.fill();
        $httpBackend.flush();
        expect(kbb.getModels).toHaveBeenCalledWith(mock.kbb.makes.Data[0], mock.kbb.years.Data[0]);
        expect(scope.manualLookup.kbb.models.list.length).toBe(2);
      });

      it('should populate the styles dropdown when a model is chosen', function() {
        spyOn(kbb, 'getBodyStyles').andCallThrough();
        $httpBackend.whenGET('/kbb/vehicle/gettrimsandvehicleidsbyyearandmodel/UsedCar/Dealer/123/2012').respond(mock.kbb.styles);
        scope.manualLookup.kbb.years.selected = mock.kbb.years.Data[0];
        scope.manualLookup.kbb.makes.selected = mock.kbb.makes.Data[0];
        scope.manualLookup.kbb.models.selected = mock.kbb.models.Data[0];
        scope.manualLookup.kbb.styles.fill();
        $httpBackend.flush();
        expect(kbb.getBodyStyles).toHaveBeenCalledWith(mock.kbb.years.Data[0], mock.kbb.models.Data[0]);
        expect(scope.manualLookup.kbb.styles.list.length).toBe(2);
      });

      it('should prevent any fill function from being called if the previous dropdowns do not have selected choices', function() {
        spyOn(kbb, 'getMakes').andCallThrough();
        spyOn(kbb, 'getModels').andCallThrough();
        spyOn(kbb, 'getBodyStyles').andCallThrough();

        scope.manualLookup.kbb.makes.fill();
        expect(kbb.getMakes).not.toHaveBeenCalled();

        scope.manualLookup.kbb.years.selected = { Id: 'id', Name: 2013 };
        scope.manualLookup.kbb.models.fill();
        expect(kbb.getModels).not.toHaveBeenCalled();

        scope.manualLookup.kbb.makes.selected = 'Focus';
        scope.manualLookup.kbb.styles.fill();
        expect(kbb.getBodyStyles).not.toHaveBeenCalled();
      });

      it('should auto-select the first make if only one is returned', function() {
        $httpBackend.whenGET('/kbb/vehicle/getmakesbyyear/UsedCar/Dealer/2012').respond(mock.kbb.makes);

        mock.kbb.makes.Data.splice(1,1);
        scope.manualLookup.kbb.years.selected = mock.kbb.years.Data[0];
        spyOn(scope.manualLookup.kbb.models, 'fill').andReturn({});
        scope.manualLookup.kbb.makes.fill();
        $httpBackend.flush();
        expect(scope.manualLookup.kbb.makes.selected).toBe(mock.kbb.makes.Data[0]);
      });

      it('should auto-select the first model if only one is returned', function() {
        $httpBackend.whenGET('/kbb/vehicle/getmodelsbyyearandmake/UsedCar/Dealer/1/2012').respond(mock.kbb.models);

        mock.kbb.models.Data.splice(1,1);
        scope.manualLookup.kbb.years.selected = mock.kbb.years.Data[0];
        scope.manualLookup.kbb.makes.selected = mock.kbb.makes.Data[0];
        spyOn(scope.manualLookup.kbb.styles, 'fill').andReturn({});
        scope.manualLookup.kbb.models.fill();
        $httpBackend.flush();
        expect(scope.manualLookup.kbb.models.selected).toBe(mock.kbb.models.Data[0]);
      });

      it('should auto-select the first style if only one is returned', function() {
        $httpBackend.whenGET('/kbb/vehicle/gettrimsandvehicleidsbyyearandmodel/UsedCar/Dealer/123/2012').respond(mock.kbb.styles);

        mock.kbb.styles.Data.splice(1,1);
        scope.manualLookup.kbb.years.selected = mock.kbb.years.Data[0];
        scope.manualLookup.kbb.makes.selected = mock.kbb.makes.Data[0];
        scope.manualLookup.kbb.models.selected = mock.kbb.models.Data[0];
        scope.manualLookup.kbb.styles.fill();
        $httpBackend.flush();
        expect(scope.manualLookup.kbb.styles.selected).toBe(mock.kbb.styles.Data[0]);
      });

      describe('lookup', function() {
        beforeEach(function() {
          spyOn(kbb, 'lookupByOptions').andCallThrough();
          $httpBackend.whenGET('/kbb/value/getvehiclevaluesallconditions/UsedCar/Dealer/2/789/12345').respond(kbbResult);
          run();
          fillKbb();
        });

        it('should reset the opposite search', function() {
          spyOn(scope.vinLookup, 'resetSearch');
          scope.manualLookup.kbb.lookup();
          expect(scope.vinLookup.resetSearch).toHaveBeenCalled();
        });

        it('should run the validate function before doing anything', function() {
          spyOn(scope.manualLookup.kbb, 'validate');
          scope.manualLookup.kbb.lookup();
          expect(scope.manualLookup.kbb.validate).toHaveBeenCalled();
        });

        it('should do nothing if the form is not valid', function() {
          scope.manualLookupForm.$valid = false;
          scope.manualLookup.kbb.lookup();
          expect(kbb.lookupByOptions).not.toHaveBeenCalled();
        });

        it('should look up the kbb values', function() {
          scope.manualLookup.kbb.lookup();
          expect(kbb.lookupByOptions).toHaveBeenCalled();
          $httpBackend.flush();
          expect(scope.results.kbb.data).toEqual(kbbResultFormatted[0]);
          expect(scope.results.kbb.noMatch).toBe(false);
          expect(scope.results.kbb.multiple).toBeFalsy();
          expect(scope.results.mileage).toBe(789);

          // expect(scope.results.description).toBe(kbbResult.Data[0].Year + ' ' + kbbResult.Data[0].Make + ' ' + kbbResult.Data[0].Model);
        });

        it('should handle no kbb matches', function() {
          kbbResult.Data = {};
          scope.manualLookup.kbb.lookup();
          $httpBackend.flush();
          expect(scope.results.kbb.data).toBe(null);
          expect(scope.results.kbb.noMatch).toBe(true);
        });
      });
    });
  });
});
