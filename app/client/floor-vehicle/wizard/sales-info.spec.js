'use strict';

describe('Controller: SalesInfoCtrl', function() {
  beforeEach(module('nextgearWebApp', 'client/login/login.template.html'));

  var
    $q,
    scope,
    moment,
    salesInfo,
    mmrObjects,
    wizardService,
    initController;

  beforeEach(inject(function(_$q_,
                             $controller,
                             $rootScope,
                             _moment_,
                             _wizardService_) {

    $q = _$q_;
    moment = _moment_;
    scope = $rootScope.$new();
    wizardService = _wizardService_;

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

    spyOn(wizardService, 'getMmrValues').and.returnValue($q.when(mmrObjects));

    // create the mock parent scope object
    scope.$parent = {
      wizardFloor: {
        valuations: {
          mmr: null,
          blackbook: null
        },
        canPayBuyer: false,
        formParts: {
          two: false,
          three: false
        },
        data: {
          PaySeller: null,
          UnitVin: null,
          UnitMileage: null,
          $selectedVehicle: null
        },
        stateChangeCounterFix: function() {
          return false;
        }
      }
    };

    scope.form = {
      $valid: false
    };

    spyOn(scope.$parent.wizardFloor, 'stateChangeCounterFix').and.callThrough();

    initController = function() {
      salesInfo = $controller('SalesInfoCtrl', {
        $scope: scope
      });
    };
    initController();
  }));

  describe('initial state of the controller', function() {
    it('should have 364 days before today as the dealer minimum purchase date', function() {
      var expectedMoment = moment().subtract(364, 'days');
      expect(salesInfo.dealerMinDate.year()).toEqual(expectedMoment.year());
      expect(salesInfo.dealerMinDate.month()).toEqual(expectedMoment.month());
      expect(salesInfo.dealerMinDate.date()).toEqual(expectedMoment.date());
    });

    it('should have 6 days before today as the auction minimum purchase date', function() {
      var expectedMoment = moment().subtract(6, 'days');
      expect(salesInfo.auctionMinDate.year()).toEqual(expectedMoment.year());
      expect(salesInfo.auctionMinDate.month()).toEqual(expectedMoment.month());
      expect(salesInfo.auctionMinDate.date()).toEqual(expectedMoment.date());
    });

    it('should have today as the maximum purchase date', function() {
      var expectedMoment = moment();
      expect(salesInfo.maxDate.year()).toEqual(expectedMoment.year());
      expect(salesInfo.maxDate.month()).toEqual(expectedMoment.month());
      expect(salesInfo.maxDate.date()).toEqual(expectedMoment.date());
    });

    it('should toggle the purchase date has value flag', function() {
      salesInfo.onPurchaseDateChange();
      expect(salesInfo.purchaseDateHasValue).toBe(false);
      salesInfo.onPurchaseDateChange('some text');
      expect(salesInfo.purchaseDateHasValue).toBe(true);
    });

    it('should start with closed date picker', function() {
      expect(salesInfo.datePicker.opened).toBe(false);
    });

    it('should toggle the date picker flag', function() {
      salesInfo.openDatePicker();
      expect(salesInfo.datePicker.opened).toBe(true);
    });

    it('should set the date format', function() {
      expect(salesInfo.dateFormat).toEqual('MM/dd/yyyy');
    });

    it('should call the state fix when the user click on the tab instead of the next button', function() {
      expect(scope.$parent.wizardFloor.stateChangeCounterFix).toHaveBeenCalled();
    });

  });

  describe('switch change of the trade in', function() {
    describe('coming from part 3 of wizard', function() {
      it('should switch form part 3 flag when can pay buyer true and non trade in', function() {
        scope.$parent.wizardFloor.canPayBuyer = true;
        // coming from part 3 of the wizard
        scope.$parent.wizardFloor.formParts.three = true;
        initController();
        salesInfo.switchChange(false);
        // should clear pay seller selection
        expect(scope.$parent.wizardFloor.data.PaySeller).toBe(null);
        // form part 3 should be invalid forcing user to go there
        expect(scope.$parent.wizardFloor.formParts.three).toBe(false);
      });

      it('should keep form part 3 flag when can pay buyer false and non trade in', function() {
        scope.$parent.wizardFloor.canPayBuyer = false;
        // coming from part 3 of the wizard
        scope.$parent.wizardFloor.formParts.three = true;
        initController();
        salesInfo.switchChange(false);
        // should set the pay seller to 'Pay Seller'
        expect(scope.$parent.wizardFloor.data.PaySeller).toBe(true);
        // should keep the original form part 3 flag
        expect(scope.$parent.wizardFloor.formParts.three).toBe(true);
      });

      it('should keep form part 3 flag when can pay buyer true and trade in', function() {
        scope.$parent.wizardFloor.canPayBuyer = true;
        // coming from part 3 of the wizard
        scope.$parent.wizardFloor.formParts.three = true;
        initController();
        salesInfo.switchChange(true);
        // set the pay seller to be 'Pay Buyer'
        expect(scope.$parent.wizardFloor.data.PaySeller).toBe(false);
        // should keep the original form part 3 flag
        expect(scope.$parent.wizardFloor.formParts.three).toBe(true);
      });
    });

    describe('not coming from part 3 of wizard', function() {

      it('should keep the original flag and clear pay seller default for non trade in', function() {
        scope.$parent.wizardFloor.canPayBuyer = true;
        // not coming from part 3 of the wizard
        scope.$parent.wizardFloor.formParts.three = false;
        initController();
        salesInfo.switchChange(false);
        // should clear the pay seller selection
        expect(scope.$parent.wizardFloor.data.PaySeller).toBe(null);
        // should keep the original form 3 flag
        expect(scope.$parent.wizardFloor.formParts.three).toBe(false);
      });

      it('should keep the original flag and set pay to seller when can pay buyer false', function() {
        scope.$parent.wizardFloor.canPayBuyer = false;
        // not coming from part 3 of the wizard
        scope.$parent.wizardFloor.formParts.three = false;
        initController();
        salesInfo.switchChange(true);
        // should set the pay seller to 'Pay Seller'
        expect(scope.$parent.wizardFloor.data.PaySeller).toBe(true);
        // should keep the original form 3 flag
        expect(scope.$parent.wizardFloor.formParts.three).toBe(false);
      });

      it('should keep the original flag and set pay to buyer when can pay buyer true', function() {
        scope.$parent.wizardFloor.canPayBuyer = true;
        // not coming from part 3 of the wizard
        scope.$parent.wizardFloor.formParts.three = false;
        initController();
        // toggle to trade in
        salesInfo.switchChange(true);
        // should set the pay seller to 'Pay Buyer'
        expect(scope.$parent.wizardFloor.formParts.three).toBe(false);
        // should keep the original form 3 flag
        expect(scope.$parent.wizardFloor.data.PaySeller).toBe(false);
      });
    });

    it('should not do anything if data is undefined', function() {
      scope.$parent.wizardFloor.data = undefined;
      initController();
      salesInfo.switchChange(true);
      expect(scope.$parent.wizardFloor.data).toBe(undefined);
    });
  });

  describe('transition validation', function() {
    it('should update the validity information for form part 2', function() {
      scope.$parent.wizardFloor.transitionValidation();
      expect(scope.$parent.wizardFloor.formParts.two).toBe(false);
      expect(scope.$parent.wizardFloor.validity).toEqual(scope.form);
      expect(scope.form.$submitted).toBe(true);
    })
  });

  describe('valuation mmr dropdown', function() {
    it('should call wizard service when UnitVin and UnitMileage is available', function() {
      scope.$parent.wizardFloor.data.UnitVin = 'ABC1234567890';
      scope.$parent.wizardFloor.data.UnitMileage = 5000;
      initController();
      expect(wizardService.getMmrValues).toHaveBeenCalledWith('ABC1234567890', 5000);
    });

    it('should set the selection to empty when coming to this page for the first time', function() {
      scope.$parent.wizardFloor.data.UnitVin = 'ABC1234567890';
      scope.$parent.wizardFloor.data.UnitMileage = 5000;
      initController();
      scope.$digest();
      expect(salesInfo.mmrValuations).toEqual(mmrObjects);
      expect(salesInfo.selectedMmrValuation).toEqual(undefined);
    });

    it('should set the selection to the previously selected mmr when coming from other page', function() {
      scope.$parent.wizardFloor.valuations.mmr = mmrObjects[0];
      scope.$parent.wizardFloor.data.UnitVin = 'ABC1234567890';
      scope.$parent.wizardFloor.data.UnitMileage = 5000;
      initController();
      scope.$digest();
      expect(salesInfo.mmrValuations).toEqual(mmrObjects);
      expect(salesInfo.selectedMmrValuation).toEqual(mmrObjects[0]);
    });

    it('changing selection should also update the valuations on parent', function() {
      scope.$parent.wizardFloor.valuations.mmr = mmrObjects[0];
      scope.$parent.wizardFloor.data.UnitVin = 'ABC1234567890';
      scope.$parent.wizardFloor.data.UnitMileage = 5000;
      initController();
      scope.$digest();
      expect(salesInfo.mmrValuations).toEqual(mmrObjects);
      expect(salesInfo.selectedMmrValuation).toEqual(mmrObjects[0]);
      salesInfo.onMmrValuationsChange(mmrObjects[1]);
      expect(scope.$parent.wizardFloor.valuations.mmr).toEqual(mmrObjects[1]);
    });
  })

});