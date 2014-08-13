'use strict';

describe('Model: VehicleDetails', function () {

  // load the service's module
  beforeEach(module('nextgearWebApp'));

  var vehicleDetails,
      api;

  beforeEach(inject(function(VehicleDetails, _api_) {
    vehicleDetails = VehicleDetails;
    api = _api_;
  }));

  it('should getDetails', function() {
    var returnVal = {};
    spyOn(api, 'request').andReturn(returnVal);
    var result = vehicleDetails.getDetails(1234);
    expect(result).toBe(returnVal);
    expect(api.request).toHaveBeenCalledWith('GET', '/floorplan/expandeddetail/1234');
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
