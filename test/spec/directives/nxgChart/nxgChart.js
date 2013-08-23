'use strict';

describe('Directive: nxgChart', function () {
  beforeEach(module('nextgearWebApp'));

  var element,
      scope;

  it('should do nothing when data is empty', inject(function ($rootScope, $compile) {
    // Setup the directive
    scope = $rootScope;
    scope.chartData = {};
    element = angular.element('<canvas nxg-chart nxg-chart-data nxg-chart-type="Pie"></canvas>');
    element = $compile(element)(scope);
    scope.$digest();
    expect(element.attr('height')).toBeUndefined();
    expect(element.attr('width')).toBeUndefined();
  }));

  it('should do something to the canvas element', inject(function ($rootScope, $compile) {
    // Setup the directive
    scope = $rootScope;
    scope.chartData = {};
    element = angular.element('<canvas nxg-chart nxg-chart-data="chartData" nxg-chart-type="Pie"></canvas>');
    element = $compile(element)(scope);
    scope.$digest();

    // Do some sanity checks
    expect(element.attr('height')).toBe('150');
    expect(element.attr('width')).toBe('300');
  }));

  it('should use the IE8 polyfill if necessary', inject(function ($rootScope, $compile) {
    // Mock for testing IE8 polyfill
    window.G_vmlCanvasManager = {initElement: angular.noop};

    // Setup the directive
    scope = $rootScope;
    scope.chartData = {};
    element = angular.element('<canvas nxg-chart nxg-chart-data="chartData" nxg-chart-type="Pie"></canvas>');
    element = $compile(element)(scope);
    scope.$digest();

    // Do some sanity checks
    expect(element.attr('height')).toBe('150');
    expect(element.attr('width')).toBe('300');
  }));

});
