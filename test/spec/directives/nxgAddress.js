'use strict';

describe('Directive: nxgAddress', function () {
  beforeEach(module('nextgearWebApp', 'scripts/directives/nxgAddress/nxgAddress.html'));

  var element,
    dScope,
    scope,
    rootScope,
    compile,
    mockAddressAccount;

  beforeEach(inject(function ($rootScope, $compile) {
    scope = $rootScope.$new();
    rootScope = $rootScope;
    compile = $compile;

    scope.info = {
      "Line1": '450 W 15th St',
      "Line2": '#8',
      "City": 'New YorK',
      "State": 'New York',
      "Zip": '10011'
    };

    mockAddressAccount = scope.info;

    element = angular.element(
      '<nxg-address city="true" info="info" line1="true" line2="true" state="true" validity="{}" zip="true"></nxg-address>'
    );
    element = $compile(element)(scope);
    $rootScope.$digest();

    dScope = element.isolateScope();
  }));

  it('should not contain any fields', function () {
    element = angular.element(
      '<nxg-address city="true" info="{}" line1="true" line2="true" state="true" validity="{}" zip="true"></nxg-address>'
    );
    element = compile(element)(scope);
    rootScope.$digest();

    dScope = element.isolateScope();

    expect(dScope.info.Line1).toBeUndefined();
    expect(dScope.info.Line2).toBeUndefined();
    expect(dScope.info.City).toBeUndefined();
    expect(dScope.info.State).toBeUndefined();
    expect(dScope.info.Zip).toBeUndefined();

  });

  it('should contain all fields', function () {
    expect(dScope.info.Line1).toEqual(mockAddressAccount.Line1);
    expect(dScope.info.Line2).toEqual(mockAddressAccount.Line2);
    expect(dScope.info.City).toEqual(mockAddressAccount.City);
    expect(dScope.info.State).toEqual(mockAddressAccount.State);
    expect(dScope.info.Zip).toEqual(mockAddressAccount.Zip);
  });

  it('should get an address GUID', function() {

  });

  it('should get an state GUID', function() {

  })

});
