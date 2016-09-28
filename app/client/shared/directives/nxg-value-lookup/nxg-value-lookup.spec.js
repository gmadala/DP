describe('Directive: nxgCreditAvailability', function() {
  beforeEach(module('nextgearWebApp', 'client/shared/directives/nxg-value-lookup/nxg-value-lookup.template.html'));

  var
    $compile,
    $q,
    $rootScope,
    Addresses,
    Kbb,
    Mmr,
    Blackbook,
    scope,
    directiveScope,
    element;

  beforeEach(inject(function(_$compile_, _$q_, _$rootScope_, _Kbb_, _Mmr_, _Blackbook_, _Addresses_) {
    $q = _$q_;
    $compile = _$compile_;
    $rootScope = _$rootScope_;

    Kbb = _Kbb_;
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

    var mmrObject = $q.when(
      [{
        "Mid": "201501756938560",
        "MakeId": "017",
        "Make": "FORD",
        "ModelId": "5693",
        "Model": "ESCAPE FWD",
        "YearId": "2015",
        "Year": "2015",
        "BodyId": "8560",
        "Body": "4D SUV 2.5L SE",
        "Display": "2015 FORD ESCAPE FWD 4D SUV 2.5L SE",
        "ExcellentWholesale": 15150,
        "GoodWholesale": 14750,
        "FairWholesale": 14400,
        "AverageWholesale": 14750
      }]
    );
    spyOn(Mmr, 'lookupByVin').and.callFake(function() {
      return mmrObject;
    });

    var kbbObject = $q.when(
      {"Excellent": 18218, "Fair": 16382, "Good": 17532, "VeryGood": 17974}
    );
    spyOn(Kbb, 'lookupByConfiguration').and.callFake(function() {
      return kbbObject;
    });

    var kbbConfigObject = $q.when(
      [{"Id": 400272}]
    );
    spyOn(Kbb, 'getConfigurations').and.callFake(function() {
      return kbbConfigObject;
    });

    var blackbookObject = $q.when(
      [{
        "VinPos1To8": "1FMCU0G7",
        "VinYearCode": "F",
        "Make": "Ford",
        "Model": "Escape SE",
        "Style": "4D SUV FWD 2.5L I-4 SMPI DOHC",
        "Year": 2015,
        "RoughValue": 16025,
        "AverageValue": 18600,
        "CleanValue": 20500,
        "ExtraCleanValue": 21450,
        "GroupNumber": "7444",
        "MakeNumber": "300",
        "UVc": "271",
        "DSCRegionalAveragePurchasePrice": null,
        "DSCRegionalMaxPurchasePrice": null,
        "DSCRegionalMinPurchasePrice": null
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

    element = angular.element(
      '<nxg-value-lookup' +
      ' vin="vin"' +
      ' odometer="odometer"' +
      ' inventory-location="inventoryLocation"' +
      ' purchase-price="purchasePrice">' +
      '</nxg-value-lookup>');
    element = $compile(element)(scope);
    $rootScope.$digest();
    directiveScope = element.isolateScope();
  }));

  it('should use main address zip code to lookup kbb', function() {
    expect(directiveScope.zipCode).toEqual('57312')
  });

  it('should not call any valuation when vin and odometer is undefined', function() {
    expect(Mmr.lookupByVin).not.toHaveBeenCalled();
    expect(Kbb.getConfigurations).not.toHaveBeenCalled();
    expect(Blackbook.lookupByVin).not.toHaveBeenCalled();

    scope.odometer = 1000;
    scope.$apply();
    expect(Mmr.lookupByVin).not.toHaveBeenCalled();
    expect(Kbb.getConfigurations).not.toHaveBeenCalled();
    expect(Blackbook.lookupByVin).not.toHaveBeenCalled();

    scope.odometer = undefined;
    scope.vin = 'ABCDE12345';
    scope.$apply();
    expect(Mmr.lookupByVin).not.toHaveBeenCalled();
    expect(Kbb.getConfigurations).not.toHaveBeenCalled();
    expect(Blackbook.lookupByVin).not.toHaveBeenCalled();
  });

  it('should not call valuation when vin is less than 10 chars', function() {
    scope.vin = 'ABCDE1234';
    scope.odometer = 5000;
    scope.$apply();

    expect(Mmr.lookupByVin).not.toHaveBeenCalled();
    expect(Kbb.getConfigurations).not.toHaveBeenCalled();
    expect(Blackbook.lookupByVin).not.toHaveBeenCalled();
  });

  it('should call valuation when vin and odometer is defined', function() {
    scope.vin = 'ABCDE12345';
    scope.odometer = 5000;
    scope.$apply();

    expect(Mmr.lookupByVin).toHaveBeenCalledWith(scope.vin, scope.odometer);
    expect(Kbb.getConfigurations).toHaveBeenCalledWith(scope.vin, directiveScope.zipCode);
    expect(Kbb.lookupByConfiguration).toHaveBeenCalledWith({"Id": 400272}, scope.odometer, directiveScope.zipCode);
    expect(Blackbook.lookupByVin).toHaveBeenCalledWith(scope.vin, scope.odometer, true);
  });

  it('should update the finance amount to correct value', function() {
    scope.vin = 'ABCDE12345';
    scope.odometer = 5000;
    scope.purchasePrice = 2000;
    scope.$apply();
    expect(directiveScope.projectedFinancedAmount).toEqual(2000);

    scope.purchasePrice = 30000;
    scope.$apply();
    expect(directiveScope.projectedFinancedAmount).toEqual(18600);
  });
});