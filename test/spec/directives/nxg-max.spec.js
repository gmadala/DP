'use strict';

describe('Directive: nxgMax', function () {
  // see http://stackoverflow.com/questions/15219717/to-test-a-custom-validation-angular-directive

  beforeEach(module('nextgearWebApp'));

  var scope, element, form;

  describe('with constant max setting', function () {

    beforeEach(inject(function ($rootScope, $compile) {
      scope = $rootScope;
      element = angular.element(
        '<form name="form">' +
          '<input type="text" name="input" ng-model="model.data" nxg-max="100"></input>' +
        '</form>'
      );
      scope.model = {data: undefined};
      element = $compile(element)($rootScope);
      scope.$digest();
      form = scope.form;
    }));

    it('should ignore non-numeric strings', function () {
      form.input.$setViewValue('abc123');
      expect(scope.model.data).toEqual('abc123');
      expect(form.input.$valid).toBe(true);

      form.input.$setViewValue(' ');
      expect(scope.model.data).toEqual(' ');
      expect(form.input.$valid).toBe(true);
    });

    it('should pass with numeric strings at or below the max', function () {
      form.input.$setViewValue('100');
      expect(scope.model.data).toEqual('100');
      expect(form.input.$valid).toBe(true);

      form.input.$setViewValue('50');
      expect(scope.model.data).toEqual('50');
      expect(form.input.$valid).toBe(true);

      form.input.$setViewValue('-300');
      expect(scope.model.data).toEqual('-300');
      expect(form.input.$valid).toBe(true);
    });

    it('should fail with numeric strings above the max', function () {
      form.input.$setViewValue('100.001');
      expect(scope.model.data).toBeUndefined();
      expect(form.input.$valid).toBe(false);

      form.input.$setViewValue('101');
      expect(scope.model.data).toBeUndefined();
      expect(form.input.$valid).toBe(false);

      form.input.$setViewValue('34958356');
      expect(scope.model.data).toBeUndefined();
      expect(form.input.$valid).toBe(false);
    });

  });

  describe('with variable max setting', function () {

    beforeEach(inject(function ($rootScope, $compile) {
      scope = $rootScope;
      element = angular.element(
        '<form name="form">' +
          '<input type="text" name="input" ng-model="model.data" nxg-max="settings.maxAllowed"></input>' +
        '</form>'
      );
      scope.model = {data: undefined};
      scope.settings = {maxAllowed: 100};
      element = $compile(element)($rootScope);
      scope.$digest();
      form = scope.form;
    }));

    it('should ignore non-numeric strings', function () {
      form.input.$setViewValue('abc123');
      expect(scope.model.data).toEqual('abc123');
      expect(form.input.$valid).toBe(true);

      form.input.$setViewValue(' ');
      expect(scope.model.data).toEqual(' ');
      expect(form.input.$valid).toBe(true);
    });

    it('should pass with numeric strings at or below the max', function () {
      form.input.$setViewValue('100');
      expect(scope.model.data).toEqual('100');
      expect(form.input.$valid).toBe(true);

      form.input.$setViewValue('50');
      expect(scope.model.data).toEqual('50');
      expect(form.input.$valid).toBe(true);

      form.input.$setViewValue('-300');
      expect(scope.model.data).toEqual('-300');
      expect(form.input.$valid).toBe(true);
    });

    it('should fail with numeric strings above the max', function () {
      form.input.$setViewValue('100.001');
      expect(scope.model.data).toBeUndefined();
      expect(form.input.$valid).toBe(false);

      form.input.$setViewValue('101');
      expect(scope.model.data).toBeUndefined();
      expect(form.input.$valid).toBe(false);

      form.input.$setViewValue('34958356');
      expect(scope.model.data).toBeUndefined();
      expect(form.input.$valid).toBe(false);
    });

    it('should respect changes to the setting', function () {
      form.input.$setViewValue('101');
      expect(scope.model.data).toBeUndefined();
      expect(form.input.$valid).toBe(false);

      scope.$apply(function () {
        scope.settings.maxAllowed = 150;
      });

      form.input.$setViewValue('100');
      expect(scope.model.data).toBe('100');
      expect(form.input.$valid).toBe(true);

      form.input.$setViewValue('120.23');
      expect(scope.model.data).toBe('120.23');
      expect(form.input.$valid).toBe(true);

      form.input.$setViewValue('152');
      expect(scope.model.data).toBeUndefined();
      expect(form.input.$valid).toBe(false);
    });

    it('should allow anything if the setting is non-numeric', function () {
      scope.$apply(function () {
        scope.settings.maxAllowed = 'foo';
      });

      form.input.$setViewValue('abc123');
      expect(scope.model.data).toEqual('abc123');
      expect(form.input.$valid).toBe(true);

      form.input.$setViewValue('50');
      expect(scope.model.data).toBe('50');
      expect(form.input.$valid).toBe(true);

      form.input.$setViewValue('10329508345');
      expect(scope.model.data).toBe('10329508345');
      expect(form.input.$valid).toBe(true);
    });

    it('should permit a setting of 0', function () {
      scope.$apply(function () {
        scope.settings.maxAllowed = 0;
      });

      form.input.$setViewValue('-1');
      expect(scope.model.data).toBe('-1');
      expect(form.input.$valid).toBe(true);

      form.input.$setViewValue('0');
      expect(scope.model.data).toBe('0');
      expect(form.input.$valid).toBe(true);

      form.input.$setViewValue('1');
      expect(scope.model.data).toBeUndefined();
      expect(form.input.$valid).toBe(false);
    });

    it('should permit a negative setting', function () {
      scope.$apply(function () {
        scope.settings.maxAllowed = -100;
      });

      form.input.$setViewValue('-100');
      expect(scope.model.data).toBe('-100');
      expect(form.input.$valid).toBe(true);

      form.input.$setViewValue('-43536546');
      expect(scope.model.data).toBe('-43536546');
      expect(form.input.$valid).toBe(true);

      form.input.$setViewValue('-50');
      expect(scope.model.data).toBeUndefined();
      expect(form.input.$valid).toBe(false);

      form.input.$setViewValue('0');
      expect(scope.model.data).toBeUndefined();
      expect(form.input.$valid).toBe(false);

      form.input.$setViewValue('50');
      expect(scope.model.data).toBeUndefined();
      expect(form.input.$valid).toBe(false);
    });

  });

});
