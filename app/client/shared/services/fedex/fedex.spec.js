'use strict'
describe("Service: FedEx", function () {
  beforeEach(module('nextgearWebApp'));

  var fedExService = null;
  var userService = null;

  beforeEach(inject(function (_fedex_, _User_) {
    fedExService = _fedex_;
    userService = _User_;
  }));

  describe("ensure wayBillPrintingEnabled returns false when non united states is used", function () {

    it("should be false when user is not united states", function () {
      spyOn(userService, "isUnitedStates").and.returnValue(false);
      expect(fedExService.wayBillPrintingEnabled()).toBe(false);
    });
  });

  describe("ensure wayBillPrintingEnabled returns proper value when user is united states and is a dealer", function () {

    it("should be false when user doesn't have buyer feature flag", function () {
      spyOn(userService, "isUnitedStates").and.returnValue(true);
      spyOn(userService, "isDealer").and.returnValue(true);
      spyOn(userService, "getFeatures").and.returnValue({});
      expect(fedExService.wayBillPrintingEnabled()).toBe(false);
    });

    it("should be false when user has buyer feature flag set to false", function () {
      spyOn(userService, "isUnitedStates").and.returnValue(true);
      spyOn(userService, "isDealer").and.returnValue(true);
      spyOn(userService, "getFeatures").and.returnValue({printFedExWaybillDealer: {enabled: false}});
      expect(fedExService.wayBillPrintingEnabled()).toBe(false);
    });

    it("should be true when user ha buyer feature flag enabled", function () {
      spyOn(userService, "isUnitedStates").and.returnValue(true);
      spyOn(userService, "isDealer").and.returnValue(true);
      spyOn(userService, "getFeatures").and.returnValue({printFedExWaybillDealer: {enabled: true}});
      expect(fedExService.wayBillPrintingEnabled()).toBe(true);
    });
  });

  describe("ensure wayBillPrintingEnabled returns proper value when user is united states and is a non-dealer", function () {

    it("should be false when user doesn't have a feature flag non-buyer", function () {
      spyOn(userService, "isUnitedStates").and.returnValue(true);
      spyOn(userService, "isDealer").and.returnValue(false);
      spyOn(userService, "getFeatures").and.returnValue({});
      expect(fedExService.wayBillPrintingEnabled()).toBe(false);
    });

    it("should be false when user has feature flag non-buyer set to false", function () {
      spyOn(userService, "isUnitedStates").and.returnValue(true);
      spyOn(userService, "isDealer").and.returnValue(false);
      spyOn(userService, "getFeatures").and.returnValue({printFedExWaybillNonDealer: {enabled: false}});
      expect(fedExService.wayBillPrintingEnabled()).toBe(false);
    });

    it("should be true when user has feature flag non-buyer enabled", function () {
      spyOn(userService, "isUnitedStates").and.returnValue(true);
      spyOn(userService, "isDealer").and.returnValue(false);
      spyOn(userService, "getFeatures").and.returnValue({printFedExWaybillNonDealer: {enabled: true}});
      expect(fedExService.wayBillPrintingEnabled()).toBe(true);
    });

  });

});