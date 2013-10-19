'use strict';

describe('Directive: nxgAutofocus', function () {
  beforeEach(module('nextgearWebApp'));

  var element;

  // No active tests for this directive - focus is hard to synthesize in the karma test runner.
  // Ideally, something like the below would work, but it doesn't. In any case, this directive provides
  // "decorative" or "convenience" behavior not crucial to the basic functioning of the app.

  xit('should focus an input', inject(function ($rootScope, $compile) {
    element = angular.element('<input type="text" nxg-autofocus>');
    element = $compile(element)($rootScope);
    $rootScope.$digest();
    expect(element.is(':focus')).toBe(true);
  }));

});
