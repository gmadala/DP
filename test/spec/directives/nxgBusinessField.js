'use strict';

describe('Directive: nxgBusinessField', function () {

  var fakeBiz = {};

  // mock $dialog service (stand-in for actual business search modal)
  // that will instantly return the fakeBiz object above as its result
  beforeEach(function () {
    module('nextgearWebApp', function($provide) {
      $provide.decorator('$dialog', function($delegate) {
        return {
          dialog: function () {
            return {
              open: function () {
                return {
                  then: function (success) {
                    success(fakeBiz);
                  }
                };
              }
            };
          }
        };
      });
    });
  });

  beforeEach(module('scripts/directives/nxgBusinessField/nxgBusinessField.html'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope, $compile) {
    scope = $rootScope.$new();
    scope.model = {
      disableMe: false
    };
    scope.callBack = angular.noop;

    element = angular.element('<input id="fooInput" nxg-business-field="seller" ng-disabled="model.disableMe" on-select="callBack(business)"></input>');
    element = $compile(element)(scope);
    $rootScope.$digest();
  }));

  it('should preserve the id of the input', function () {
    expect(element.find('input').attr('id')).toBe('fooInput');
  });

  it('should pass the mode through to the business search', inject(function ($dialog) {
    spyOn($dialog, 'dialog').andCallThrough();
    element.scope().openBusinessSearch();
    expect($dialog.dialog.mostRecentCall.args[0].resolve.mode()).toBe('seller');
  }));

  it('should respect the ng-disabled attribute on the original input', function () {
    var iScope = element.scope();
    spyOn(iScope, 'openBusinessSearch');

    expect(element.find('input').attr('disabled')).toBeUndefined();
    element.find('a').trigger('click');
    expect(iScope.openBusinessSearch.calls.length).toBe(1);

    scope.$apply(function () {
      scope.model.disableMe = true;
    });
    expect(element.find('input').attr('disabled')).toBe('disabled');
    element.find('a').trigger('click');
    expect(iScope.openBusinessSearch.calls.length).toBe(1);
  });

  it('should provide a call-back on business selection', function () {
    spyOn(scope, 'callBack');
    element.find('a').trigger('click');
    expect(scope.callBack).toHaveBeenCalledWith(fakeBiz);
  });

  it('should clear values when it becomes disabled', function () {
    spyOn(scope, 'callBack');
    element.find('input').val('blahblah');

    scope.$apply(function () {
      scope.model.disableMe = true;
    });

    expect(scope.callBack).toHaveBeenCalledWith(null);
    expect(element.find('input').val()).toBe('');
  });

});
