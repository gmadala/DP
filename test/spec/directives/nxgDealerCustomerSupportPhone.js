'use strict';

describe('Service: dealerCustomerSupportPhone', function () {

  beforeEach(module('nextgearWebApp'));

  var $q, $injector, $rootScope;
  var user;
  beforeEach(inject(function (_$injector_) {
    $injector = _$injector_;
    $q = $injector.get('$q');
    user = $injector.get('User');
    $rootScope = $injector.get('$rootScope');
  }));

  it('should return the correct csc information based on the API value.', function () {
    spyOn(user, 'getInfo').andReturn($q.when({
      CSCPhoneNumber: '1234567890'
    }));

    var dealerCustomerSupportPhone = $injector.get('dealerCustomerSupportPhone');

    $rootScope.$digest();
    dealerCustomerSupportPhone.then(function (phoneNumber) {
      expect(phoneNumber.value).toBe('1234567890');
      expect(phoneNumber.formatted).toBe('(123)&nbsp;456&#8209;7890');
    });
  });
});


describe('Directive: nxgDealerCustomerSupportPhone', function () {
  beforeEach(module('nextgearWebApp'));

  it('should replace with the assigned number', inject(function ($rootScope, $compile, User, $q) {
    var scope, element;

    scope = $rootScope;

    spyOn(User, 'getInfo').andReturn($q.when({
      CSCPhoneNumber: '1234567890'
    }));

    element = angular.element(
      '<nxg-dealer-customer-support-phone>'
    );
    element = $compile(element)($rootScope);
    scope.$digest();

    expect(element.text()).toEqual('(123) 456‑7890');
  }));
});
