describe('Directive: nxgCreditAvailability', function() {
  beforeEach(module('nextgearWebApp', 'client/shared/directives/nxg-value-lookup/nxg-value-lookup.template.html'));

  var
    $compile,
    $rootScope,
    scope,
    directiveScope,
    element;

  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;

    scope = $rootScope.$new();
    scope.mmr = undefined;
    scope.blackbook = undefined;
    scope.purchasePrice = undefined;
    scope.projectedFinancedAmount = undefined;

    element = angular.element(
      '<nxg-value-lookup' +
      ' mmr="mmr"' +
      ' blackbook="blackbook"' +
      ' purchase-price="purchasePrice"' +
      ' projected-financed-amount="projectedFinancedAmount"' +
      '>' +
      '</nxg-value-lookup>');
    element = $compile(element)(scope);
    $rootScope.$digest();
    directiveScope = element.isolateScope();
  }));

  it('should select the max of the valuations if purchase price is over the valuations', function() {
    scope.mmr = 5000;
    scope.blackbook = 6000;
    scope.$apply();
    scope.purchasePrice = 7000;
    scope.$apply();
    expect(directiveScope.projectedFinancedAmount).toEqual(6000);
  });

  it('should select the purchase price if max of the valuations over is over the purchase price', function() {
    scope.mmr = 5000;
    scope.blackbook = 6000;
    scope.$apply();
    scope.purchasePrice = 4000;
    scope.$apply();
    expect(directiveScope.projectedFinancedAmount).toEqual(4000);
  });
});