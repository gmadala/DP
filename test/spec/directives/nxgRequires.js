'use strict';

describe('Directive: nxgRequires', function () {
  beforeEach(module('nextgearWebApp'));

  var element,
    scope,
    form;

  beforeEach(inject(function ($rootScope, $compile) {
    scope = $rootScope.$new();
    scope.model = {
      foo: null,
      data: undefined
    };

    element = angular.element(
      '<form name="form">' +
        '<input type="text" name="input" ng-model="model.data" nxg-requires="model.foo != null"></input>' +
      '</form>'
    );
    element = $compile(element)(scope);
    scope.$digest();
    form = scope.form;
  }));

  it('should mark the field as invalid when the condition is false', function () {
    form.input.$setViewValue('abc123');
    expect(form.input.$valid).toBe(false);
    expect(form.input.$error.nxgRequires).toBe(true);
  });

  it('should mark the field as valid when the condition is true', function () {
    form.input.$setViewValue('abc123');
    scope.$apply(function () {
      scope.model.foo = 'bar';
    });
    expect(form.input.$valid).toBe(true);
    expect(form.input.$error.nxgRequires).toBe(false);
  });

  it('should keep the same validity state when the field value changes', function () {
    scope.$apply(function () {
      scope.model.foo = 'bar';
    });
    form.input.$setViewValue('def456');
    expect(form.input.$valid).toBe(true);
    expect(form.input.$error.nxgRequires).toBe(false);
  });

  it('should pass through the model value regardless of validity state', function () {
    scope.$apply(function () {
      scope.model.foo = null;
    });
    form.input.$setViewValue('abc123');
    expect(scope.model.data).toBe('abc123');
    scope.$apply(function () {
      scope.model.foo = 'bar';
    });
    expect(scope.model.data).toBe('abc123');
  });

});
