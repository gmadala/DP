'use strict';

describe("Model: Payments", function () {

  beforeEach(module('nextgearWebApp'));

  var payments,
    httpBackend;

  beforeEach(inject(function ($httpBackend, Payments) {
    payments = Payments;
    httpBackend = $httpBackend;
  }));

  describe('requestUnappliedFundsPayout method', function () {

    var request;

    beforeEach(function () {
      httpBackend.expectPOST('/payment/payoutUnappliedFunds').respond(function(method, url, data) {
        request = angular.fromJson(data);
        return [200, {
          "Success": true,
          "Message": null
        }, {}];
      });
    });

    it('should return a promise', function () {
      var ret = payments.requestUnappliedFundsPayout();
      expect(typeof ret.then).toBe('function');
    });

    it('should make the expected http request', function () {
      payments.requestUnappliedFundsPayout();
      expect(httpBackend.flush).not.toThrow();
    });

    it('should send the expected data', function () {
      payments.requestUnappliedFundsPayout(200, 'foo');
      httpBackend.flush();
      expect(request.RequestAmount).toBe(200);
      expect(request.BankAccountId).toBe('foo');
    });

  });


});
