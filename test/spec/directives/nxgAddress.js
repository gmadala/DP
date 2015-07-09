'use strict';

describe('Directive: nxgAddress', function () {
  beforeEach(module('nextgearWebApp', 'scripts/directives/nxgAddress/nxgAddress.html'));

  var element,
    dScope,
    scope,
    rootScope,
    compile,
    user,
    $q,
    mockAddress,
    mockAddressAccount,
    mockStates;

  beforeEach(inject(function ($rootScope, $compile, User, _$q_) {
    scope = $rootScope.$new();
    rootScope = $rootScope;
    compile = $compile;
    user = User;
    $q = _$q_;

    scope.account = {
      "Line1": '450 W 15th St',
      "Line2": '#8',
      "City": 'New York',
      "State": 'New York',
      "Zip": '10011'
    };

    mockAddressAccount = scope.account;

    mockStates = {
      states: [
        {
          "StateId": "7c36afed-4941-4e83-b9a5-3a0bcfe44f10",
          "StateName": "Alabama"
        },
        {
          "StateId": "6a63763d-8c69-44ff-af14-29b0144a21ec",
          "StateName": "Alaska"
        },
        {
          "StateId": "b1ebdded-b72d-4a12-9f3a-076302e3124a",
          "StateName": "Alberta"
        }
      ]
    };

    spyOn(user, 'getStatics').andReturn($q.when(mockStates));

    element = angular.element(
      '<nxg-address city="true" info="account" line1="true" line2="true" state="true" validity="{}" zip="true"></nxg-address>'
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

  it('should modify the state of account to be a GUID', function() {
    dScope.inputs.state = mockStates.states[0];
    dScope.$digest();

    expect(dScope.info.State).toEqual("7c36afed-4941-4e83-b9a5-3a0bcfe44f10");
  });

  it('should get a list of states from endpoint', function() {
    expect(dScope.states).toEqual(mockStates.states);
  });
});
