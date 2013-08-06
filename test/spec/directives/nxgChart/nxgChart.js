'use strict';

describe('Directive: nxgChart', function () {
  beforeEach(module('nextgearWebApp', 'scripts/directives/nxgChart/nxgChart.html'));

  var element;

  it('should add a canvas element', inject(function ($rootScope, $compile) {
    element = angular.element('<div nxg-chart></div>');
    element = $compile(element)($rootScope);
  }));
});
