'use strict';

describe('Directive: nxgActivity', function () {
  beforeEach(module('nextgearWebApp', 'scripts/directives/nxgActivity/nxgActivity.html'));

  var element;

  it('should hide & show based on activity indicator presence', inject(function ($rootScope, $compile, activity) {
    element = angular.element('<div nxg-activity></div>');
    element = $compile(element)($rootScope);
    $rootScope.$digest();

    expect(element.css('display')).toBe('none');

    $rootScope.$apply(function () {
      activity.add('foo');
    });
    expect(element.css('display')).not.toBe('none');

    $rootScope.$apply(function () {
      activity.remove('foo');
    });
    expect(element.css('display')).toBe('none');
  }));

});
