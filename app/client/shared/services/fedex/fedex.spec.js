'use strict'
describe("Service: FedEx", function () {
  beforeEach(module('nextgearWebApp'));

  var fedExService = null;
  var userService = null;
  var kissMetricInfo = null;
  var $rootScope = null;
  var $httpBackend = null;

  beforeEach(inject(function (_fedex_, _User_, _kissMetricInfo_, _$rootScope_, _$httpBackend_) {
    fedExService = _fedex_;
    userService = _User_;
    kissMetricInfo = _kissMetricInfo_;
    $rootScope = _$rootScope_;
    $httpBackend = _$httpBackend_;
  }));

  describe("ensure that kissMetricInfo service is called after getWaybill is used", function () {

    beforeEach(function () {
      spyOn(kissMetricInfo, "getKissMetricInfo").and.callThrough();
    });

    it("kissMetricInfo service should be called", function () {
      fedExService.getWaybill("123-123-123", true);

      $httpBackend.whenGET("/fedex/waybill/123-123-123").respond({ data: { trackingNumber: "123456789", labelImage: null } });
      $httpBackend.expectGET("/fedex/waybill/123-123-123");

      $httpBackend.whenGET("/info/v1_1/businesshours").respond(true);
      $httpBackend.expectGET("/info/v1_1/businesshours");

      $httpBackend.flush();
      $rootScope.$digest();

      expect(kissMetricInfo.getKissMetricInfo).toHaveBeenCalled();
    });

  });

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

    it("should render new image from the wayBill", function () {
      var contentType = "text/plain";
      var base64String = "VGVzdFN0cmluZw==";
      var resultByteArray = [];

      var expectedByteArray = new Uint8Array([84, 101, 115, 116, 83, 116, 114, 105, 110, 103]);

      fedExService.base64ToBlob(base64String, contentType, 512, function (byteArray) {
        resultByteArray = byteArray.slice(0);
      });
      expect(resultByteArray[0]).toEqual(expectedByteArray);
    });

  });

});
