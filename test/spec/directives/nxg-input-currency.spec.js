'use strict';

describe('Directive: nxgInputCurrency', function () {
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
        'ng-pattern="/^[0-9]{1,3}(?:,?[0-9]{3})*(\.[0-9]{2})?$/" ' +
        'required nxg-input-currency=10000 ></input>' +
      '</form>'
    );
    element = $compile(element)(scope);
    scope.$digest();
    form = scope.form;
  }));

  it('should remove any commas and set the model value to be a float value', function () {
    form.input.$setViewValue('1,234.34');
    expect(scope.model.data).toBe(1234.34);

    form.input.$setViewValue('1,234');
    expect(scope.model.data).toBe(1234);

    form.input.$setViewValue('12.34');
    expect(scope.model.data).toBe(12.34);
  });

  it('should set the input to invalid if the value exceeds the max', function() {
    form.input.$setViewValue('123,123,123');
    expect(form.input.$error.max).toBe(true);
  });

  it('should send the value back if it is not a string', function() {
    form.input.$setViewValue(123);
    expect(scope.model.data).toBe(123);
  });

  it('should not set the model value if the string is not properly formatted', function() {
    form.input.$setViewValue('123k');
    expect(scope.model.data).not.toBeDefined();
  });
});
