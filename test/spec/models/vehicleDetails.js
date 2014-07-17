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

  it('should getLanding', function() {
    var returnVal = {};
    spyOn(api, 'request').andReturn(returnVal);
    var result = vehicleDetails.getLanding(123);
    expect(result).toBe(returnVal);
    expect(api.request).toHaveBeenCalledWith('GET', '/floorplan/mobiledetails/landing/123');
  });

  it('should getVehicleInfo', function() {
    var returnVal = {};
    spyOn(api, 'request').andReturn(returnVal);
    var result = vehicleDetails.getVehicleInfo(123);
    expect(result).toBe(returnVal);
    expect(api.request).toHaveBeenCalledWith('GET', '/floorplan/mobiledetails/vehicleinfo/123');
  });

  it('should getTitleInfo', function() {
    var returnVal = {};
    spyOn(api, 'request').andReturn(returnVal);
    var result = vehicleDetails.getTitleInfo(123);
    expect(result).toBe(returnVal);
    expect(api.request).toHaveBeenCalledWith('GET', '/floorplan/mobiledetails/titleinfo/123');
  });

  it('should getFlooringInfo', function() {
    var returnVal = {};
    spyOn(api, 'request').andReturn(returnVal);
    var result = vehicleDetails.getFlooringInfo(123);
    expect(result).toBe(returnVal);
    expect(api.request).toHaveBeenCalledWith('GET', '/floorplan/mobiledetails/flooringinfo/123');
  });

  it('should getValueInfo', function() {
    var returnVal = {};
    spyOn(api, 'request').andReturn(returnVal);
    var result = vehicleDetails.getValueInfo(123);
    expect(result).toBe(returnVal);
    expect(api.request).toHaveBeenCalledWith('GET', '/floorplan/mobiledetails/valueinfo/123');
  });

  it('should getFinancialSummary', function() {
    var returnVal = {};
    spyOn(api, 'request').andReturn({
      then: function(success) {
        return success(returnVal);
      }
    });
    var result = vehicleDetails.getFinancialSummary(123);
    expect(result).toBe(returnVal);
    expect(api.request).toHaveBeenCalledWith('GET', '/floorplan/mobiledetails/financialsummary/123');
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
