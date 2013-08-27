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
      requireMe: true,
      disableMe: false,
      bizness: null
    };

    element = angular.element('<form name="myForm">' +
      '<input id="fooInput" name="fooInputName" nxg-business-field="seller" ' +
      'ng-disabled="model.disableMe" selected-business="model.bizness"' +
      'ng-required="model.requireMe">' +
      '</input></form>');
    element = $compile(element)(scope);
    $rootScope.$digest();
  }));

  it('should preserve the id of the input', function () {
    expect(element.find('input').attr('id')).toBe('fooInput');
  });

  it('should pass the mode through to the business search', inject(function ($dialog) {
    spyOn($dialog, 'dialog').andCallThrough();
    element.find('input').scope().openBusinessSearch();
    expect($dialog.dialog.mostRecentCall.args[0].resolve.mode()).toBe('seller');
  }));

  it('should respect the ng-disabled attribute on the original input', function () {
    var iScope = element.find('input').scope();
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

  it('should trigger a business search on blur if a search value is present but not resolved', function () {
    spyOn(element.find('input').scope(), 'openBusinessSearch');

    element.find('input').scope().query = 'foo';
    element.find('input').trigger('blur');

    expect(element.find('input').scope().openBusinessSearch).toHaveBeenCalled();
  });

  it('should not force a business search on blur if no search value is present', function () {
    spyOn(element.find('input').scope(), 'openBusinessSearch');
    element.find('input').trigger('blur');
    expect(element.find('input').scope().openBusinessSearch).not.toHaveBeenCalled();
  });

  it('should not force a business search on blur if a selected business is already present', function () {
    spyOn(element.find('input').scope(), 'openBusinessSearch');
    scope.model.bizness = {};
    element.find('input').scope().query = 'foo';
    element.find('input').trigger('blur');
    expect(element.find('input').scope().openBusinessSearch).toHaveBeenCalled();
  });

  it('should publish an ngModelController under the original input name', function () {
    expect(scope.myForm.fooInputName).toBeDefined();
    expect(typeof scope.myForm.fooInputName.$valid).toBe('boolean');
  });

  it('should provide validity state based on the ng-requires attribute', function () {
    expect(scope.myForm.fooInputName.$valid).toBe(false);
    scope.$apply(function () {
      scope.model.requireMe = false;
    });
    expect(scope.myForm.fooInputName.$valid).toBe(true);
  });

  it('should update validity state when selected business changes', function () {
    expect(scope.myForm.fooInputName.$valid).toBe(false);

    // select a business
    scope.$apply(function () {
      scope.model.bizness = fakeBiz;
    });
    expect(scope.myForm.fooInputName.$valid).toBe(true);

    // deselect (by entering a value in the field)
    scope.$apply(function () {
      scope.myForm.fooInputName.$setViewValue('blah');
    });
    expect(scope.myForm.fooInputName.$valid).toBe(false);
  });

  it('should clear the query on a reset event', function () {
    element.find('input').scope().query = 'foobar';
    scope.$broadcast('reset');
    expect(element.find('input').scope().query).toBe('');
  });

});
