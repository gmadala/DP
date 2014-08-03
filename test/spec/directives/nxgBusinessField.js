'use strict';

describe('Directive: nxgBusinessField', function () {

  var fakeBiz = {},
      timeout;

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

      timeout = jasmine.createSpy().andReturn({
        then: function(callback) {
          return callback();
        }
      });

      $provide.provider('$timeout', function() {
        this.$get = function() {
          return timeout;
        };

      });

    });
  });

  beforeEach(module('scripts/directives/nxgBusinessField/nxgBusinessField.html'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope, $compile, $httpBackend) {
    $httpBackend.whenGET('scripts/directives/nxgIcon/nxgIcon.html').respond('<div></div>')

    scope = $rootScope.$new();
    scope.model = {
      requireMe: true,
      disableMe: false,
      bizness: null
    };

    scope.theForm = {
      inputBiz: {}
    };
    scope.validity = {};

    element = angular.element('<form name="myForm">' +
      '<input id="fooInput" name="fooInputName" nxg-business-field="sellers" ' +
      'ng-disabled="model.disableMe" selected-business="model.bizness"' +
      'ng-required="model.requireMe" form="theForm" validity="validity">' +
      '</input></form>');
    element = $compile(element)(scope);
    $rootScope.$digest();
  }));

  it('should preserve the id of the input', function () {
    expect(element.find('input').attr('id')).toBe('fooInput');
  });

  it('should set the searchBuyersMode for the search to false if field is in sellers mode', inject(function ($dialog) {
    spyOn($dialog, 'dialog').andCallThrough();
    element.find('input').val('fooBiz');
    element.find('input').scope().openBusinessSearch();
    expect($dialog.dialog.mostRecentCall.args[0].resolve.searchBuyersMode()).toBe(false);
  }));

  it('should wait for 200ms before opening dialog to let click event finish', inject(function ($dialog) {
    spyOn($dialog, 'dialog').andCallThrough();
    element.find('input').val('fooBiz');
    element.find('input').scope().openBusinessSearch();
    expect(timeout).toHaveBeenCalledWith(angular.noop, 200);
  }));

  it('should only open one modal, even if openBusinessSearch() is called twice', inject(function ($dialog) {
    spyOn($dialog, 'dialog').andReturn({
      open: function () {
        return {
          then: function (success) {
            // Don't call callback, since that simulates closing the modal,
            // which we don't want immediately in this test
          }
        };
      }
    });
    element.find('input').val('fooBiz');
    element.find('input').scope().openBusinessSearch();
    element.find('input').scope().openBusinessSearch();
    expect(timeout.calls.length).toBe(1);
  }));

  it('should set the searchBuyersMode for the search to true if field is in buyers mode',
    inject(function ($dialog, $compile, $rootScope) {
    element = angular.element('<form name="myForm">' +
      '<input id="fooInput" name="fooInputName" nxg-business-field="buyers" ' +
      'ng-disabled="model.disableMe" selected-business="model.bizness"' +
      'ng-required="model.requireMe" form="theForm" validity="validity">' +
      '</input></form>');
    element = $compile(element)(scope);
    $rootScope.$digest();

    spyOn($dialog, 'dialog').andCallThrough();
    element.find('input').val('fooBiz');
    element.find('input').scope().openBusinessSearch();
    expect($dialog.dialog.mostRecentCall.args[0].resolve.searchBuyersMode()).toBe(true);
  }));

  it('should respect the ng-disabled attribute on the original input', function () {
    var iScope = element.find('input').scope();
    spyOn(iScope, 'openBusinessSearch');

    expect(element.find('input').attr('disabled')).toBeUndefined();
    element.find('button').trigger('click');
    expect(iScope.openBusinessSearch.calls.length).toBe(1);

    scope.$apply(function () {
      scope.model.disableMe = true;
    });
    expect(element.find('input').attr('disabled')).toBe('disabled');
    element.find('button').trigger('click');
    expect(iScope.openBusinessSearch.calls.length).toBe(1);
  });

  it('should only open business dialog if input is valid', inject(function($dialog, $compile, $rootScope) {
    element = angular.element('<form name="myForm">' +
      '<input id="fooInput" name="fooInputName" nxg-business-field="buyers" ' +
      'ng-disabled="model.disableMe" selected-business="model.bizness"' +
      'ng-required="model.requireMe" form="theForm" validity="validity">' +
      '</input></form>');
    element = $compile(element)(scope);
    $rootScope.$digest();

    spyOn($dialog, 'dialog').andCallThrough();
    element.find('button').trigger('click');
    expect($dialog.dialog).not.toHaveBeenCalled();

    element.find('input').val('ab');
    element.find('button').trigger('click');
    expect($dialog.dialog).not.toHaveBeenCalled();

    element.find('input').val(fakeBiz);
    element.find('button').trigger('click');
    expect(scope.model.bizness).toBe(fakeBiz);
  }));

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

  it('should provide validity state based on minimum 3 characters', function () {
    expect(scope.myForm.fooInputName.$valid).toBe(false);
    element.find('input').val('fo');
    element.find('input').trigger('input');
    expect(scope.myForm.fooInputName.$valid).toBe(false);
    expect(scope.myForm.fooInputName.$error.minlength).toBe(true);
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
