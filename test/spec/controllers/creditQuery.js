'use strict';

describe('Controller: CreditQueryCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var CreditQueryCtrl,
    scope,
    creditQuery,
    mockQuery,
    opts,
    dialog,
    httpBackend,
    shouldSucceed,
    errMock = {
      dismiss: angular.noop,
      text: 'Oops'
    },
    mockRes;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $q, CreditQuery, $httpBackend) {
    shouldSucceed = true;
    mockRes = [
      {
        CreditType: 'foo',
        CreditAvailable: 'bar'
      }
    ];

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
        }
      }
    };

    opts = {
      businessId: 123,
      businessNumber: 456,
      auctionAccessNumbers: 12345,
      businessName: 'foo',
      address: 'blah',
      city: 'anytown',
      state: 'anystate',
      zipCode: 53675,
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

    scope = $rootScope.$new();
    CreditQueryCtrl = $controller('CreditQueryCtrl', {
      $scope: scope,
      dialog: dialog,
      options: opts,
      CreditQuery: mockQuery
    });
  }));

  describe('business object on scope', function() {
    it('should attach options to the scope', function() {
      expect(typeof scope.business).toBe('object');
      expect(scope.business.id).toBe(opts.businessId);
      expect(scope.business.number).toBe(opts.businessNumber);
      expect(scope.business.auctionAccessNumbers).toBe(opts.auctionAccessNumbers);
      expect(scope.business.name).toBe(opts.businessName);
      expect(scope.business.address).toBe(opts.address);
      expect(scope.business.city).toBe(opts.city);
      expect(scope.business.state).toBe(opts.state);
      expect(scope.business.zipCode).toBe(opts.zipCode);
    });

    it('should create a credit query object', function() {
      expect(typeof scope.business.creditQuery).toBe('object');
      expect(scope.business.creditQuery.requested).toBeDefined(false);
      expect(scope.business.creditQuery.retrieved).toBeDefined(false);
      expect(scope.business.creditQuery.loading).toBe(false);
      expect(scope.business.creditQuery.error).toBe(null);
    })

    describe('get function', function() {
      it('should call the credit query model function', function() {
        spyOn(mockQuery, 'get').andCallThrough();
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

      it('should update the status variables and not populate results array if it fails', function(){
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
    });
  });

  it('should have a function to close the dialog', function() {
    spyOn(dialog, 'close');
    scope.close();
    expect(dialog.close).toHaveBeenCalled();
  });

  describe('autoQueryCredit conditional', function() {
    beforeEach(inject(function ($httpBackend) {
      spyOn(mockQuery, 'get').andCallThrough();
    }));

    it('should do nothing if its value is false', function() {
      expect(mockQuery.get).not.toHaveBeenCalled();
    });

    it('should tell the scope to run the credit query if true', inject(function($controller) {
      opts.autoQueryCredit = true;

      CreditQueryCtrl = $controller('CreditQueryCtrl', {
        $scope: scope,
        dialog: dialog,
        options: opts,
        CreditQuery: mockQuery
      });

      expect(mockQuery.get).toHaveBeenCalled();
    }));
  });
});
