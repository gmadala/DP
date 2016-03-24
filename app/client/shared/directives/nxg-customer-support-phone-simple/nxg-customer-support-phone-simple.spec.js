'use strict';

describe('Directive: nxgCustomerSupportPhoneSimple', function () {

  beforeEach(module('nextgearWebApp'));

  var scope, element;
  var phone = '888.969.3721';

  it('should replace with phone number', inject(function ($rootScope, $compile) {
    scope = $rootScope;
    element = angular.element(
      '<nxg-customer-support-phone-simple>'
    );
    element = $compile(element)($rootScope);
    scope.$digest();

    expect(element[0].tagName.toLowerCase()).toBe('span');
    expect(element.text()).toBe(phone);
  }));
});
