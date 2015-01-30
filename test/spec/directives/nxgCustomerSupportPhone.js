'use strict';

describe('Directive: nxgCustomerSupportPhone', function () {

  beforeEach(module('nextgearWebApp'));

  var scope, element;
  var phoneToronto = 'Canada - Toronto: 1-877-864-9291';
  var phoneMontreal = 'Canada - Montreal: 1-855-864-9291';
  var phoneUnitedStates = 'United States: 1-888-969-3721';

  it('should replace with phone number', inject(function ($rootScope, $compile) {
    scope = $rootScope;
    element = angular.element(
      '<nxg-customer-support-phone>'
    );
    element = $compile(element)($rootScope);
    scope.$digest();

    expect(element[0].tagName.toLowerCase()).toBe('span');
    var elementText = element.text();
    expect(elementText).toContain(phoneToronto);
    elementText = elementText.replace(phoneToronto, '');
    expect(elementText).toContain(phoneMontreal);
    elementText = elementText.replace(phoneMontreal, '');
    expect(elementText).toContain(phoneUnitedStates);
    elementText = elementText.replace(phoneUnitedStates, '');
    expect(elementText.trim()).toEqual('');
  }));

});
