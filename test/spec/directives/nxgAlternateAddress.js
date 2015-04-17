'use strict';

describe('Directive: nxgAlternateAddress', function () {
  beforeEach(module('nextgearWebApp', 'scripts/directives/nxgAlternateAddress/nxgAlternateAddress.html'));

  var element,
      scope,
      rootScope,
      dScope,
      addressesMock,
      addrResponseMock,
      compile,
      defaultAddrResponseMock;

  beforeEach(inject(function ($rootScope, $compile, Addresses, $httpBackend) {
    $httpBackend.expectGET('scripts/directives/nxgIcon/nxgIcon.html').respond('<div></div>');
    scope = $rootScope.$new();
    compile = $compile;
    rootScope = $rootScope;
    scope.payment = {
      floorplanId: 123,
      overrideAddressId: false,
      isPayoff: true
    };

    addrResponseMock =[
      {
        "AddressId": "be9b22cb-5896-4356-86a0-e932293faa6a",
        "City": "Dallas",
        "IsTitleReleaseAddress": false,
        "Line1": "5333 West Kiest Blvd",
        "State": "TX",
      },
      {
        "AddressId": "bedssss2cb-5896-4356-86a0-e932293faa6a",
        "City": "Rochester",
        "IsTitleReleaseAddress": true,
        "Line1": "123 Elm St.",
        "Line2": "Apt. 4",
        "State": "NY",
      },
      {
        "AddressId": "be9b22cb-5896-4356-86a0-e93rwrfaa6a",
        "City": "Beverly Hills",
        "IsTitleReleaseAddress": false,
        "Line1": "184 Dollar Ave.",
        "State": "CA",
      }
    ];

    defaultAddrResponseMock = {
      "AddressId": "bedssss2cb-5896-4356-86a0-e932293faa6a",
      "City": "Rochester",
      "IsTitleReleaseAddress": true,
      "Line1": "123 Elm St.",
      "State": "NY",
    };

    Addresses.getTitleAddresses = function() {
      return addrResponseMock;
    };

    Addresses.getDefaultTitleAddress = function() {
      return defaultAddrResponseMock;
    };

    addressesMock = Addresses;

    scope.disabled = false;

    element = angular.element(
      '<div nxg-alternate-address="payment" ng-disabled="disabled"></div>');
    element = $compile(element)(scope);
    $rootScope.$digest();

    dScope = element.isolateScope();
  }));

  it('should set the title address and default address', function() {
    expect(dScope.addrList).toEqual(addrResponseMock);
    expect(dScope.addrLoaded).toBe(true);
    expect(dScope.defaultAddress).toBe(defaultAddrResponseMock);
    expect(dScope.showSelectMenu).toBe(false);
    expect(dScope.selectedAddress).toBe(defaultAddrResponseMock);
  });

  it('should set the selectedAddress value to the default on load if the payment address is not already overridden', function() {
    dScope.payment.overrideAddress = null;
    dScope.$digest();
    expect(dScope.selectedAddress).toBe(defaultAddrResponseMock);
  });

  it('should update the payment.overrideAddress field when selectedAddress changes', function() {
    dScope.payment.overrideAddress = null;
    dScope.selectedAddress = 'new address';
    dScope.$digest();
    expect(dScope.payment.overrideAddress).toBe('new address');

    dScope.selectedAddress = dScope.defaultAddress;
    dScope.$digest();
    expect(dScope.payment.overrideAddress).toBe(null);
  });

  describe('onClickAddress function', function() {
    it('should update the showSelectMenu variable', function() {
      expect(typeof dScope.onClickAddress).toBe('function');
      expect(dScope.showSelectMenu).toBe(false);
      dScope.onClickAddress();
      expect(dScope.showSelectMenu).toBe(true);
    });
  });

  it('should set the default showSelectMenu if attribute is set', function() {
    var scope = rootScope.$new();
    scope.payment = {
      floorplanId: 123,
      overrideAddressId: false,
      isPayoff: true
    };

    element = angular.element(
      '<div nxg-alternate-address="payment" show-select-menu></div>');
    element = compile(element)(scope);
    rootScope.$digest();

    dScope = element.isolateScope();

    expect(dScope.showSelectMenu).toBe(true);
  });

  it('should be disabled when disabled is true', function() {
    expect(element.find('button').attr('disabled')).toBeFalsy();
    expect(element.find('select').attr('disabled')).toBeFalsy();
    scope.$apply(function() {
      scope.disabled = true;
    });
    expect(element.find('button').attr('disabled')).toBeTruthy();
    expect(element.find('select').attr('disabled')).toBeTruthy();
  });
});
