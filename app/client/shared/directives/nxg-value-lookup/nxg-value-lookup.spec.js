describe('Directive: nxgCreditAvailability', function() {
  beforeEach(module('nextgearWebApp', 'client/shared/directives/nxg-value-lookup/nxg-value-lookup.template.html'));

  var
    $compile,
    $rootScope,
    $httpBackend,
    scope,
    directiveScope,
    element;

  beforeEach(inject(function(_$rootScope_, _$compile_, _$httpBackend_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $httpBackend = _$httpBackend_;

    var fakeLineOfCredits = {
      Success: true,
      Message: null,
      Data: {
        LinesOfCredit: [{
          'CreditTypeName': 'Retail',
          'LineOfCreditId': 'e70e442b-c364-4985-9c1c-3ddbe5dcb6ec',
          'LineOfCreditAmount': 99999999.0000,
          'TempLineOfCreditAmount': 0.0,
          'TempLineOfCreditExpiration': null,
          'AvailableCreditAmount': 97182593.1100
        }, {
          'CreditTypeName': 'Salvage',
          'LineOfCreditId': 'b60dc924-797f-4c0a-8112-63f98d0dfaf8',
          'LineOfCreditAmount': 10000000.0000,
          'TempLineOfCreditAmount': 0.0,
          'TempLineOfCreditExpiration': null,
          'AvailableCreditAmount': 9903253.4000
        }]
      }
    };

    $httpBackend.expect('GET', function(url) {
      return url.indexOf('/dealer/buyer/dashboard') === 0;
    }).respond(200, fakeLineOfCredits);

    scope = $rootScope.$new();
    scope.currentCreditType = undefined;

    element = angular.element('<nxg-credit-availability credit-type="currentCreditType"></nxg-credit-availability>');
    element = $compile(element)(scope);
    $rootScope.$digest();
    $httpBackend.flush();
  }));

  it('should display total available lines of credit', function() {
    directiveScope = element.isolateScope();
    var lineOfCredits = directiveScope.lineOfCredits;
    expect(lineOfCredits.hasOwnProperty('total.lineOfCredits')).toBe(true);
    expect(lineOfCredits.hasOwnProperty('b60dc924-797f-4c0a-8112-63f98d0dfaf8')).toBe(true);
    expect(lineOfCredits.hasOwnProperty('e70e442b-c364-4985-9c1c-3ddbe5dcb6ec')).toBe(true);

    expect(directiveScope.creditTypeName).toEqual('Total');
    expect(directiveScope.creditLimit).toEqual(numeral(10000000 + 99999999).format('($0.0a)'));
  });

  it('should display total available lines of credit', function() {
    directiveScope = element.isolateScope();

    scope.currentCreditType = {
      LineOfCreditId: 'b60dc924-797f-4c0a-8112-63f98d0dfaf8'
    };
    scope.$apply();
    expect(directiveScope.creditTypeName).toEqual('Salvage');
    expect(directiveScope.creditLimit).toEqual(numeral(10000000).format('($0.0a)'));

    scope.currentCreditType = {
      LineOfCreditId: 'e70e442b-c364-4985-9c1c-3ddbe5dcb6ec'
    };
    scope.$apply();
    expect(directiveScope.creditTypeName).toEqual('Retail');
    expect(directiveScope.creditLimit).toEqual(numeral(99999999).format('($0.0a)'));
  });
});