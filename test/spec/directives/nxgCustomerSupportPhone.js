'use strict';

describe('Directive: nxgCustomerSupportPhone', function () {

  beforeEach(module('nextgearWebApp'));

  var scope, element;
  var phoneQuebec = 'Canada - Quebec    1.877.864.9291';
  var phoneNational = 'Canada - National    1.855.864.9291';
  var phoneUnitedStates = 'United States    1.888.969.3721';

  it('should replace with phone number', inject(function ($rootScope, $compile) {
    scope = $rootScope;
    element = angular.element(
      '<nxg-customer-support-phone>'
    );
    element = $compile(element)($rootScope);
    scope.$digest();

    expect(element[0].tagName.toLowerCase()).toBe('span');
    var elementText = element.text();
    expect(elementText).toContain(phoneQuebec);
    elementText = elementText.replace(phoneQuebec, '');
    expect(elementText).toContain(phoneNational);
    elementText = elementText.replace(phoneNational, '');
    expect(elementText).toContain(phoneUnitedStates);
    elementText = elementText.replace(phoneUnitedStates, '');
    expect(elementText.trim()).toEqual('');
  }));

});
