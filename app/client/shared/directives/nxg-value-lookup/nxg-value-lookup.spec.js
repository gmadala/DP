describe('Directive: nxgCreditAvailability', function() {
  beforeEach(module('nextgearWebApp', 'client/shared/directives/nxg-value-lookup/nxg-value-lookup.template.html'));

  var
    $compile,
    $q,
    $rootScope,
    Addresses,
    Mmr,
    Blackbook,
    scope,
    directiveScope,
    element;

  beforeEach(inject(function(_$compile_, _$q_, _$rootScope_, _Mmr_, _Blackbook_, _Addresses_) {
    $q = _$q_;
    $compile = _$compile_;
    $rootScope = _$rootScope_;

    Mmr = _Mmr_;
    Blackbook = _Blackbook_;

    /** Prepare all the spies and fake data **/
    var mockAddresses = [
      {
        AddressId: '1',
        Zip: '57350'
      },
      {
        AddressId: '2',
        Zip: '57350'
      },
      {
        AddressId: '3',
        IsMainAddress: true,
        Zip: '57312'
      }
    ];
    Addresses = _Addresses_;
    spyOn(Addresses, 'getActivePhysical').and.returnValue(mockAddresses);

    var blackbookObject = $q.when(
      [{
        "RoughValue": 16000,
        "AverageValue": 17000,
        "CleanValue": 18000,
        "ExtraCleanValue": 19000,
        "GroupNumber": "7444"
      }, {
        "RoughValue": 18000,
        "AverageValue": 19000,
        "CleanValue": 20000,
        "ExtraCleanValue": 21000,
        "GroupNumber": "7445"
      }]
    );
    spyOn(Blackbook, 'lookupByVin').and.callFake(function() {
      return blackbookObject;
    });

    scope = $rootScope.$new();
    scope.vin = undefined;
    scope.odometer = undefined;
    scope.inventoryLocation = undefined;
    scope.purchasePrice = undefined;
    scope.projectedFinancedAmount = undefined;
    scope.selectedVehicle = undefined;

    element = angular.element(
      '<nxg-value-lookup' +
      ' vin="vin"' +
      ' odometer="odometer"' +
      ' inventory-location="inventoryLocation"' +
      ' purchase-price="purchasePrice"' +
      ' projected-financed-amount="projectedFinancedAmount"' +
      ' selected-vehicle="selectedVehicle"' +
      '>' +
      '</nxg-value-lookup>');
    element = $compile(element)(scope);
    $rootScope.$digest();
    directiveScope = element.isolateScope();
  }));

  it('should not call any valuation when vin and odometer is undefined', function() {
    expect(Blackbook.lookupByVin).not.toHaveBeenCalled();

    scope.odometer = 1000;
    scope.$apply();
    expect(Blackbook.lookupByVin).not.toHaveBeenCalled();

    scope.odometer = undefined;
    scope.vin = 'ABCDE12345';
    scope.$apply();
    expect(Blackbook.lookupByVin).not.toHaveBeenCalled();
  });

  it('should not call valuation when vin is less than 10 chars', function() {
    scope.vin = 'ABCDE1234';
    scope.odometer = 5000;
    scope.$apply();

    expect(Blackbook.lookupByVin).not.toHaveBeenCalled();
  });

  it('should call valuation when vin and odometer is defined', function() {
    scope.vin = 'ABCDE12345';
    scope.odometer = 5000;
    scope.$apply();

    expect(Blackbook.lookupByVin).toHaveBeenCalledWith(scope.vin, scope.odometer, true);
  });

  it('should update the finance amount the purchase price or blackbook value', function() {
    scope.vin = 'ABCDE12345';
    scope.odometer = 5000;
    scope.purchasePrice = 2000;
    scope.selectedVehicle = {
      "GroupNumber": "7445"
    };
    scope.$apply();
    // should pick the purchase price since it's lower vs highest of the valuation.
    expect(directiveScope.projectedFinancedAmount).toEqual(2000);

    scope.purchasePrice = 30000;
    scope.$apply();
    // should pick the blackbook since it's lower vs purchase price and blackbook is the highest of all the valuation.
    expect(directiveScope.projectedFinancedAmount).toEqual(19000);
  });

  it('should reset the valuation when resetting the vin', function() {
    scope.vin = undefined;
    scope.$apply();
    expect(directiveScope.baseValuationUnavailable).toBe(false);
  });

  it('should reset the valuation when resetting the odometer', function() {
    scope.odometer = undefined;
    scope.$apply();
    expect(directiveScope.baseValuationUnavailable).toBe(false);
  });

  it('should reset the projected financed amount when resetting the purchase price', function() {
    scope.purchasePrice = undefined;
    scope.$apply();
    expect(directiveScope.projectedFinancedAmount).toBe(undefined);
  });
});