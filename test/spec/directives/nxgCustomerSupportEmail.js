'use strict';

describe('Directive: nxgCustomerSupportEmail', function () {

  beforeEach(module('nextgearWebApp'));

  var scope, element;
  var emailToronto = 'Toronto: DealerServicesToronto@nextgearcapital.com';
  var emailMontreal = 'Montreal: DealerServicesMontreal@nextgearcapital.com';
  var emailUnitedStates = 'United States: CustomerService@nextgearcapital.com';

  it('should replace with email address', inject(function ($rootScope, $compile) {
    scope = $rootScope;
    element = angular.element(
      '<nxg-customer-support-email>'
    );
    element = $compile(element)($rootScope);
    scope.$digest();

    expect(element[0].tagName.toLowerCase()).toBe('span');
    var elementText = element.text();
    expect(elementText).toContain(emailToronto);
    elementText = elementText.replace(emailToronto, '');
    expect(elementText).toContain(emailMontreal);
    elementText = elementText.replace(emailMontreal, '');
    expect(elementText).toContain(emailUnitedStates);
    elementText = elementText.replace(emailUnitedStates, '');
    expect(elementText.trim()).toEqual('');
  }));

});
