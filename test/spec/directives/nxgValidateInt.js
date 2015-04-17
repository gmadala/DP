'use strict';

describe('Directive: nxgValidateInt', function () {
  beforeEach(module('nextgearWebApp'));

  var element,
    scope,
    form;

  beforeEach(inject(function ($rootScope, $compile) {
    scope = $rootScope.$new();
    scope.model = {
      data: undefined
    };

    element = angular.element(
      '<form name="form">' +
        '<input type="text" name="input" ng-model="model.data" ' +
        'ng-pattern="/^[0-9]{1,3}(?:,?[0-9]{3})*(\\.[0-9]{2})?$/" nxg-validate-int=6 ></input>' +
      '</form>'
    );
    element = $compile(element)(scope);
    scope.$digest();
    form = scope.form;
  }));

  it('should remove any non-digit and non-decimal-point characters', function () {
    form.input.$setViewValue('123');
    expect(scope.model.data).toBe('123');

    form.input.$setViewValue('123.34');
    expect(scope.model.data).toBe('123.34');

    form.input.$setViewValue('123,234');
    expect(scope.model.data).toBe('123234');
  });

  it('should set the input to invalid if the length exceeds the max', function() {
    form.input.$setViewValue('123,123,123');
    expect(form.input.$error.maxlength).toBe(true);
  });

  it('should defer to earlier, and likely more sensitive, validators', function () {
    form.input.$setViewValue('1pq3');
    expect(scope.model.data).toBe(undefined);
    expect(form.input.$error.pattern).toBe(true);
  });

});
