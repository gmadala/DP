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

    element = angular.element('<input id="test-focus" type="text" nxg-focus="focusTasks($event, \'ok\')">');
    element = $compile(element)(scope);
    $rootScope.$digest();
  }));

  it('should execute the expression on focus in the context of the scope', function () {
    // because the focus event is finicky and won't get triggered
    // via trigger('focus') or focus()
    var ev = jQuery._data( element[0], "events" );
    ev.focus[0].handler();
    expect(scope.foo).toBe('bar ok');
  });
});
