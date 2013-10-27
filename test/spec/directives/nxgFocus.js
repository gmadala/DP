'use strict';

describe('Directive: nxgFocus', function () {
  beforeEach(module('nextgearWebApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope, $compile) {
    scope = $rootScope.$new();
    scope.foo = 'bar';
    scope.focusTasks = function (event, value) {
      this.foo += ' ' + value;
      scope.event = event;
    };

    element = angular.element('<input type="text" nxg-focus="focusTasks($event, \'ok\')"></input>');
    element = $compile(element)(scope);
    $rootScope.$digest();
  }));

  it('should execute the expression on focus in the context of the scope', function () {
    // console.log(scope.foo);
    // element.trigger('focus');
    // console.log(scope.foo);
    // expect(scope.foo).toBe('bar ok');
  });

  it('should expose the event object', function () {
    // element.trigger('focus');
    // expect(scope.event.preventDefault).toBeDefined();
  });

});
