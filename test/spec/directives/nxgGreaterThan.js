'use strict';

describe('Directive: nxgGreaterThan', function () {
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
        '<input type="text" name="input" ng-model="model.data1">' +
        '<input type="text" name="input2" ng-model="model.data2" nxg-greater-than="model.data1">' +
      '</form>'
    );
    element = $compile(element)(scope);
    scope.$digest();
    form = scope.form;
  }));

  it('should set input to invalid if first value is greater than second value', function () {
    form.input.$setViewValue('123');
    expect(scope.model.data1).toEqual('123');
    form.input2.$setViewValue('12');
    expect(scope.model.data2).toEqual('12');
    scope.$digest();
    expect(form.input2.$error.greaterThan).toBe(true);
  });

  it('should set input to valid if first value is less than second value', function () {
    form.input.$setViewValue('12');
    form.input2.$setViewValue('123');
    scope.$digest();
    // TODO: In 1.3.16, the greaterThan field will not gets added to the $error array unless they are set to false.
    expect(form.input2.$error.greaterThan).toBe(undefined);
  });

  it('should set the input to valid if either input is empty', function() {
    form.input.$setViewValue('');
    form.input2.$setViewValue('12');
    scope.$digest();
    expect(form.input2.$error.greaterThan).toBe(undefined);
  });

  it('should set the input to valid if either input is empty', function() {
    form.input.$setViewValue('23');
    form.input2.$setViewValue('');
    scope.$digest();
    expect(form.input2.$error.greaterThan).toBe(undefined);
  });


});
