'use strict';

describe('Directive: nxgDateField', function () {
  beforeEach(module('nextgearWebApp', 'scripts/directives/nxgDateField/nxgDateField.html'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope, $compile) {
    scope = $rootScope;
    scope.bar = new Date();
    element = angular.element('<form name="form">' +
      '<input name="dateInput" id="foo" ng-model="bar" nxg-date-field />' +
      '</form>');
    element = $compile(element)(scope);
    scope.$digest();
  }));

  it('should replace the input with bs-datepicker-ified input + button', function () {
    expect(element.find('input').attr('bs-datepicker')).toBeDefined();
    expect(element.find('button').attr('data-toggle')).toBe('datepicker');
  });

  it('should keep the id on the input itself', function () {
    expect(element.find('#foo').is('input')).toBe(true);
  });

  it('should not interfere with ng-model working', function () {
    var value = new Date(2013, 0, 1);
    scope.form.dateInput.$setViewValue(value);
    expect(scope.bar).toBe(value);
  });

  describe('notFutureDates functionality', function () {
    
    it('should say the following dates are not in the future', function() {

      // Today
      expect(scope.notFutureDates(new Date())).toBeTruthy();

      // Yesterday
      var yesterday = new Date();
      yesterday.setDate(yesterday.getDate()-1);
      expect(scope.notFutureDates(yesterday)).toBeTruthy();

      // Today at 11:59pm
      var today = new Date();
      today.setHours(23, 59, 59, 999);
      expect(scope.notFutureDates(today)).toBeTruthy();

    });

    it('should say the following dates are in the future', function() {
      
      // Tomorrow
      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate()+1);
      expect(scope.notFutureDates(tomorrow)).toBeFalsy();
    });

  });

  describe('beforeShowDay support', function () {

    beforeEach(inject(function ($rootScope, $compile) {
      scope = $rootScope;
      scope.bar = new Date();
      scope.onDayRender = jasmine.createSpy('onDayRender');
      element = angular.element('<form name="form">' +
        '<input name="dateInput" id="foo" ng-model="bar" nxg-date-field before-show-day="onDayRender(date)" />' +
        '</form>');
      element = $compile(element)(scope);
      scope.$digest();
    }));

    it('should cause the before-show-day function to be called with date(s) being rendered', function () {
      expect(scope.onDayRender).toHaveBeenCalled();
      expect(angular.isDate(scope.onDayRender.mostRecentCall.args[0])).toBe(true);
    });

  });

});
