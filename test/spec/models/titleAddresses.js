'use strict';

describe('Model: TitleAddresses', function () {

  // load the service's module
  beforeEach(module('nextgearWebApp'));

  // instantiate service
  var titleAddresses,
      httpBackend,
      getResponse, getData, getAddrResponse,
      rootScope;

  beforeEach(inject(function (TitleAddresses, $httpBackend, $rootScope) {
    titleAddresses = TitleAddresses;
    httpBackend = $httpBackend;
    rootScope = $rootScope;

    getResponse = {
      Success: true,
      Message: null,
      Data: {
        Addresses: [
          {
            BusinessAddressId: 1234,
            IsTitleReleaseAddress: true
          },
          {
            BusinessAddressId: 5678,
            IsTitleReleaseAddress: false
          }
        ],
        OtherSetting: 'foo'
      }
    };

    getAddrResponse = {
      Success: true,
      Message: null,
      Data: {
        BusinessAddressId: 1234,
        IsTitleReleaseAddress: true
      }
    };
  }));

  describe('getAddresses function', function () {

    it('should make an API request', function () {
      httpBackend.expectGET('/UserAccount/settings/').respond(getResponse);

      titleAddresses.getAddresses();
      expect(httpBackend.flush).not.toThrow();
    });

    it('should grab just addresses', function () {
      httpBackend.expectGET('/UserAccount/settings/').respond(getResponse);
      var result;
      titleAddresses.getAddresses().then(function(res) {
        result = res;
      });
      httpBackend.flush();
      rootScope.$digest();
      expect(result).toEqual(getResponse.Data.Addresses);
    });
  });

  describe('getDefaultAddress function', function() {
    it('should make an API request if there is no default address yet', function() {
      httpBackend.expectGET('/UserAccount/settings/').respond(getResponse);
      titleAddresses.getDefaultAddress();
      expect(httpBackend.flush).not.toThrow();
    });

    it('should grab the correct default address', function() {
      httpBackend.expectGET('/UserAccount/settings/').respond(getResponse);
      var result;
      titleAddresses.getDefaultAddress().then(function(res) {
        result = res;
      });
      httpBackend.flush();
      rootScope.$digest();
      expect(result).toEqual(getAddrResponse.Data);
    });
  });
});
