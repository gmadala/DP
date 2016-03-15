'use strict';

describe('Controller: CreditQueryCtrl', function() {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var CreditQueryCtrl,
    scope,
    mockQuery,
    opts,
    dialog,
    httpBackend,
    shouldSucceed,
    mockKissMetricInfo,
    errMock = {
      dismiss: angular.noop,
      text: 'Oops'
    },
    mockRes;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope, $q, CreditQuery, $httpBackend, _metric_) {
    shouldSucceed = true;
    mockRes = [{
      CreditType: 'foo',
      CreditAvailable: 'bar'
    }];

    mockQuery = {
      get: function() {
        return {
          then: function(success, failure) {
            if (shouldSucceed) {
              success(mockRes);
            } else {
              failure(errMock);
            }
          }
        };
      }
    };

    opts = {
      businessId: 123,
      businessNumber: 456,
      businessAuctionAccessNumbers: 12345,
      businessName: 'foo',
      businessAddress: 'blah',
      businessCity: 'anytown',
      businessState: 'anystate',
      businessZip: 53675,
      autoQueryCredit: false
    };

    dialog = {
      close: angular.noop
    };

    httpBackend = $httpBackend;
    httpBackend.expectPOST('/dealer/creditQueryandlog/123')
      .respond({
        Success: true,
        Message: null,
        Data: []
      });

    mockKissMetricInfo = {
      getKissMetricInfo: function() {
        return $q.when({
          height: 1080,
          isBusinessHours: true,
          vendor: 'Google Inc.',
          version: 'Chrome 44',
          width: 1920
        });
      }
    };

    httpBackend.whenGET('/info/v1_1/businesshours').respond($q.when({}));

    scope = $rootScope.$new();
    CreditQueryCtrl = $controller('CreditQueryCtrl', {
      $scope: scope,
      $uibModalInstance: dialog,
      options: opts,
      CreditQuery: mockQuery,
      kissMetricInfo: mockKissMetricInfo,
      metric: _metric_
    });
  }));

  describe('business object on scope', function() {
    it('should attach options to the scope', function() {
      expect(typeof scope.business).toBe('object');
      expect(scope.business.id).toBe(opts.businessId);
      expect(scope.business.number).toBe(opts.businessNumber);
      expect(scope.business.auctionAccessNumbers).toBe(opts.businessAuctionAccessNumbers);
      expect(scope.business.name).toBe(opts.businessName);
      expect(scope.business.address).toBe(opts.businessAddress);
      expect(scope.business.city).toBe(opts.businessCity);
      expect(scope.business.state).toBe(opts.businessState);
      expect(scope.business.zipCode).toBe(opts.businessZip);
    });

    it('should create a credit query object', function() {
      expect(typeof scope.business.creditQuery).toBe('object');
      expect(scope.business.creditQuery.requested).toBeDefined(false);
      expect(scope.business.creditQuery.retrieved).toBeDefined(false);
      expect(scope.business.creditQuery.loading).toBe(false);
      expect(scope.business.creditQuery.error).toBe(null);
    });

    describe('get function', function() {
      it('should call the credit query model function', function() {
        spyOn(mockQuery, 'get').and.callThrough();
        scope.business.creditQuery.get(opts.businessId);
        expect(mockQuery.get).toHaveBeenCalled();
      });

      it('should update the status variables and results array if successful', function() {
        scope.business.creditQuery.get(opts.businessId);
        expect(scope.business.creditQuery.loading).toBe(false);
        expect(scope.business.creditQuery.requested).toBe(true);
        expect(scope.business.creditQuery.retrieved).toBe(true);
        expect(scope.business.creditQuery.error).toBe(null);
        expect(scope.business.creditQuery.results).toBe(mockRes);
      });

      it('should update the status variables and not populate results array if it fails', function() {
        shouldSucceed = false;
        spyOn(errMock, 'dismiss');
        scope.business.creditQuery.get(opts.businessId);
        expect(scope.business.creditQuery.loading).toBe(false);
        expect(scope.business.creditQuery.requested).toBe(true);
        expect(scope.business.creditQuery.retrieved).toBe(true);
        expect(scope.business.creditQuery.results).toEqual([]);

        expect(errMock.dismiss).toHaveBeenCalled();
        expect(scope.business.creditQuery.error).toBe(errMock.text);
      });

      it('should return true when user clicks on Individual Dealer LOC Query', function() {
        scope.business.creditQuery.get(opts.businessId);
        scope.$apply();
        expect(scope.kissMetricData.isBusinessHours).toBe(true);
        expect(scope.kissMetricData.height).toBe(1080);
        expect(scope.kissMetricData.vendor).toBe('Google Inc.');
        expect(scope.kissMetricData.version).toBe('Chrome 44');
        expect(scope.kissMetricData.width).toBe(1920);
      });
    });
  });

  it('should have a function to close the dialog', function() {
    spyOn(dialog, 'close');
    scope.close();
    expect(dialog.close).toHaveBeenCalled();
  });

  describe('autoQueryCredit conditional', function() {
    beforeEach(inject(function($httpBackend) {
      spyOn(mockQuery, 'get').and.callThrough();
    }));

    it('should do nothing if its value is false', function() {
      expect(mockQuery.get).not.toHaveBeenCalled();
    });

    it('should tell the scope to run the credit query if true', inject(function($controller) {
      opts.autoQueryCredit = true;

      CreditQueryCtrl = $controller('CreditQueryCtrl', {
        $scope: scope,
        $uibModalInstance: dialog,
        options: opts,
        CreditQuery: mockQuery
      });

      expect(mockQuery.get).toHaveBeenCalled();
    }));
  });
});
