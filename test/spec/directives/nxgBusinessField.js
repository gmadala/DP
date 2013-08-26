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
      disableMe: false,
      bizness: null
    };

    element = angular.element('<input id="fooInput" nxg-business-field="seller" ' +
      'ng-disabled="model.disableMe" selected-business="model.bizness"></input>');
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

  it('should update the selected-business on business selection', function () {
    element.find('a').trigger('click');
    expect(scope.model.bizness).toBe(fakeBiz);
  });

  it('should clear values when it becomes disabled', function () {
    element.find('input').val('blahblah');
    scope.model.bizness = {};

    scope.$apply(function () {
      scope.model.disableMe = true;
    });

    expect(scope.model.bizness).toBe(null);
    expect(element.find('input').val()).toBe('');
  });

  it('should force a business search on blur if a search value is present but not resolved', function () {
    spyOn(element.scope(), 'openBusinessSearch');

    element.scope().query = 'foo';
    element.find('input').trigger('blur');

    expect(element.scope().openBusinessSearch).toHaveBeenCalled();
  });

  it('should not force a business search on blur if no search value is present', function () {
    spyOn(element.scope(), 'openBusinessSearch');
    element.find('input').trigger('blur');
    expect(element.scope().openBusinessSearch).not.toHaveBeenCalled();
  });

  it('should not force a business search on blur if a selected business is already present', function () {
    spyOn(element.scope(), 'openBusinessSearch');
    scope.model.bizness = {};
    element.scope().query = 'foo';
    element.find('input').trigger('blur');
    expect(element.scope().openBusinessSearch).toHaveBeenCalled();
  });

});
