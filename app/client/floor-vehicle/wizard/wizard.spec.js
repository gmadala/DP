'use strict';

describe('Controller: SalesInfoCtrl', function() {
  beforeEach(module('nextgearWebApp', 'client/login/login.template.html'));

  var
    $q,
    scope,
    Mmr,
    Blackbook,
    mmrObjects,
    blackbookObjects,
    wizardService;

  var api;
  var messages;
  var $httpBackend;

  beforeEach(inject(function(_$q_,
                             $controller,
                             $rootScope,
                             _api_,
                             _Mmr_,
                             _Blackbook_,
                             _wizardService_,
                             _$httpBackend_,
                             _messages_) {

    $q = _$q_;
    scope = $rootScope.$new();

    api = _api_;
    messages = _messages_;
    $httpBackend = _$httpBackend_;

    Mmr = _Mmr_;
    Blackbook = _Blackbook_;
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

    spyOn(Mmr, 'lookupByVin').and.returnValue($q.when(mmrObjects));
    spyOn(Blackbook, 'lookupByVin').and.returnValue($q.when(blackbookObjects));

  }));

  describe('mmr service', function() {
    it('should call mmr service on different odometer or vin', function() {
      wizardService.getMmrValues('ABCD', 100);
      scope.$digest();
      wizardService.getMmrValues('ABCD', 1000);
      scope.$digest();
      wizardService.getMmrValues('ABCDE', 1000);
      scope.$digest();
      wizardService.getMmrValues('ABCDE', 10000);
      scope.$digest();
      expect(Mmr.lookupByVin).toHaveBeenCalled();
      expect(Mmr.lookupByVin.calls.count()).toBe(4);
    });

    it('should not call mmr service when calling with the same vin and odometer', function() {
      wizardService.getMmrValues('ABCD', 100);
      scope.$digest();
      wizardService.getMmrValues('ABCD', 100);
      scope.$digest();
      wizardService.getMmrValues('ABCD', 100);
      scope.$digest();
      wizardService.getMmrValues('ABCD', 100);
      scope.$digest();
      expect(Mmr.lookupByVin).toHaveBeenCalled();
      expect(Mmr.lookupByVin.calls.count()).toBe(1);
    });

    it('should call mmr service again when calling with the different vin or odometer', function() {
      wizardService.getMmrValues('ABCD', 100);
      scope.$digest();
      wizardService.getMmrValues('ABCD', 100);
      scope.$digest();
      wizardService.getMmrValues('ABCD', 1000);
      scope.$digest();
      wizardService.getMmrValues('ABCDE', 1000);
      scope.$digest();
      expect(Mmr.lookupByVin).toHaveBeenCalled();
      expect(Mmr.lookupByVin.calls.count()).toBe(3);
    });
  });

  describe('blackbook service', function() {
    it('should call blackbook service different vin or odometer', function() {
      wizardService.getBlackbookValues('ABCD', 100);
      scope.$digest();
      wizardService.getBlackbookValues('ABCD', 1000);
      scope.$digest();
      wizardService.getBlackbookValues('ABCDE', 1000);
      scope.$digest();
      wizardService.getBlackbookValues('ABCDE', 10000);
      scope.$digest();
      expect(Blackbook.lookupByVin).toHaveBeenCalled();
      expect(Blackbook.lookupByVin.calls.count()).toBe(4);
    });

    it('should not call blackbook service when calling with the same vin and odometer', function() {
      wizardService.getBlackbookValues('ABCD', 100);
      scope.$digest();
      wizardService.getBlackbookValues('ABCD', 100);
      scope.$digest();
      wizardService.getBlackbookValues('ABCD', 100);
      scope.$digest();
      wizardService.getBlackbookValues('ABCD', 100);
      scope.$digest();
      expect(Blackbook.lookupByVin).toHaveBeenCalled();
      expect(Blackbook.lookupByVin.calls.count()).toBe(1);
    });

    it('should call blackbook service again when calling with the different vin or odometer', function() {
      wizardService.getBlackbookValues('ABCD', 100);
      scope.$digest();
      wizardService.getBlackbookValues('ABCD', 100);
      scope.$digest();
      wizardService.getBlackbookValues('ABCD', 1000);
      scope.$digest();
      wizardService.getBlackbookValues('ABCDE', 1000);
      scope.$digest();
      expect(Blackbook.lookupByVin).toHaveBeenCalled();
      expect(Blackbook.lookupByVin.calls.count()).toBe(3);
    });

    it('should clear error messages when the lookup throw exceptions', function() {
      // this will create unable to communicate dialog
      $httpBackend.whenGET('/analytics/v1_2/blackbook/ABCD/100').respond();
      spyOn(messages, 'list').and.callThrough();

      Blackbook.lookupByVin.and.callThrough();
      wizardService.getBlackbookValues('ABCD', 100);
      $httpBackend.flush();

      expect(messages.list).toHaveBeenCalled();
      expect(messages.list()).toEqual([]);
    });
  });
});