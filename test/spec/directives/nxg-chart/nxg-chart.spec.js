'use strict';

describe('Directive: nxgChart', function () {
  beforeEach(module('nextgearWebApp'));

  var element,
      scope,
      outerScope;

  beforeEach(inject(function($rootScope, $compile) {
    outerScope = $rootScope.$new();
    outerScope.mockData = [
      ['label1', 10],
      ['label2', 20],
      ['label3', 30]
    ];
    element = angular.element('<div nxg-chart nxg-chart-data="mockData" nxg-chart-type="bar" nxg-chart-description-x="Foo Description" nxg-chart-data-name="Foo Data Name" nxg-chart-tooltip="true"></div>')

    element = $compile(element)(outerScope);
    $rootScope.$digest();
  }));

  it('should attach the given parameters to the scope', function (){
    var iScope = element.isolateScope();
    expect(iScope.data).toEqual(outerScope.mockData);
    expect(iScope.type).toBe('bar');
    expect(iScope.descriptionX).toBe('Foo Description');
    expect(iScope.dataName).toBe('Foo Data Name');
    expect(iScope.tooltip).toBe('true');
  });
});
