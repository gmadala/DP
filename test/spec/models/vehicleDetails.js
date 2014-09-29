'use strict';

describe('Model: VehicleDetails', function () {

  // load the service's module
  beforeEach(module('nextgearWebApp'));

  var vehicleDetails,
      api,
      getDetailsReturn = {
        'FinancialSummaryInfo': {
          'FloorplanTotal': 3600.0000,
          'TotalPaid': 655.6400,
          'TotalOutstanding': 3109.3600,
          'InterestPaid': 16.0600,
          'PrincipalPaid': 540.0000,
          'CollateralProtectionPaid': 14.5800,
          'FeesPaid': 85.0000,
          'InterestOutstanding': 23.6000,
          'PrincipalOutstanding': 3060.0000,
          'CollateralProtectionOutstanding': 25.7600,
          'FeesOutstanding': 0.0,
          'NextPaymentAmount': 508.3600,
          'NextPaymentDueDate': "2014-10-08",
          'PrincipalDue': 459.0000,
          'InterestPaymentTotal': 23.6000,
          'CollateralProtectionPaymentTotal': 25.7600,
          'FeesPaymentTotal': 0.0,
          'Scheduled': false,
          'WebScheduledPaymentId': null,
          'ScheduledPaymentDate': null,
          'CurtailmentPaymentScheduled': false,
          'FloorplanActivity': []
        }
      };

  describe('getDetails', function() {
    beforeEach(inject(function (VehicleDetails, _api_) {
      vehicleDetails = VehicleDetails;
      api = _api_;
      spyOn(api, 'request').andReturn({
        then: function (f) {
          return {
            then: function(f2) {
              var r2 = f.apply(this, [getDetailsReturn]);
              if (f2) {
                return f2.apply(this, [r2]);
              }
              return r2;
            }
          };
        }
      });
    }));

    it('should getDetails', function () {
      var result;
      vehicleDetails.getDetails(1234).then(function(r) {
        result = r;
      });
      expect(result).toBe(getDetailsReturn);
      expect(api.request).toHaveBeenCalledWith('GET', '/floorplan/expandeddetail/1234');
    });

    it('should add up Floor Plan Total', function () {
      var result;
      vehicleDetails.getDetails(123).then(function(r) {
          result = r;
        }
      );
      expect(result.FinancialSummaryInfo.FloorplanTotal).toBe(result.FinancialSummaryInfo.TotalPaid + result.FinancialSummaryInfo.TotalOutstanding);
    });
  });

  it('should getPaymentDetails', function() {
    var returnVal = {};
    spyOn(api, 'request').andReturn(returnVal);
    var result = vehicleDetails.getPaymentDetails(123, 456);
    expect(result).toBe(returnVal);
    expect(api.request).toHaveBeenCalledWith('GET', '/floorplan/mobiledetails/financialsummary/payment/123/456');
  });

  it('should getFeeDetails', function() {
    var returnVal = {};
    spyOn(api, 'request').andReturn(returnVal);
    var result = vehicleDetails.getFeeDetails(123, 456);
    expect(result).toBe(returnVal);
    expect(api.request).toHaveBeenCalledWith('GET', '/floorplan/mobiledetails/financialsummary/fee/123/456');
  });
});
