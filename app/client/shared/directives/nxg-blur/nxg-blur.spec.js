'use strict';

describe('Directive: nxgBlur', function () {
  beforeEach(module('nextgearWebApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope, $compile) {
    scope = $rootScope.$new();
    scope.foo = 'bar';
    scope.blurTasks = function (event, value) {
      this.foo += ' ' + value;
      scope.event = event;
    };

    element = angular.element('<input type="text" nxg-blur="blurTasks($event, \'ok\')">');
    element = $compile(element)(scope);
    $rootScope.$digest();
  }));

  it('should execute the expression on blur in the context of the scope', function () {
    element.trigger('blur');
    expect(scope.foo).toBe('bar ok');
  });

  it('should expose the event object', function () {
    element.trigger('blur');
    expect(scope.event.preventDefault).toBeDefined();
  });

});
