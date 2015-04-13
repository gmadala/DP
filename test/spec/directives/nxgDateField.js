'use strict';

describe('Directive: nxgDateField', function () {
  beforeEach(module('nextgearWebApp', 'scripts/directives/nxgDateField/nxgDateField.html'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope, $compile, $httpBackend) {
    $httpBackend.expectGET('scripts/directives/nxgIcon/nxgIcon.html').respond('<div></div>');

    scope = $rootScope;
    scope.bar = new Date();
    element = angular.element('<form name="form">' +
      '<input name="dateInput" id="foo" ng-model="bar" nxg-date-field required />' +
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

  it('should transfer required attribute to input', function () {
    expect(element.find('input').attr('required')).toBeDefined();
  });

  describe('edge case', function () {

    it('should fill current date on keydown enter if empty', function () {

      scope.bar = undefined;
      var input = element.find('input');
      element.children().trigger($.Event('show'));
      scope.$digest();
      input.val('');
      input.trigger($.Event( "keydown", { keyCode: 13 } ));
      scope.$digest();
      expect(scope.bar).toBeDefined();
      expect(moment(new Date()).diff(scope.bar, 'days')).toEqual(0);
    });

    it('should set invalid if non-date is entered into field on blur', function () {
      scope.bar = new Date(2013, 0, 1);
      scope.$digest();
      var input = element.find('input');
      input.val('foofers');
      input.trigger('blur')
      expect(scope.form.$error.date).toBeTruthy();
    });

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

    it('should say null and NaN dates are in the past', function() {

      expect(scope.notFutureDates(null)).toBeTruthy();
      expect(scope.notFutureDates(NaN)).toBeTruthy();
    });

  });

  describe('notPastDates functionality', function () {

    it('should say the following dates are not in the past', function() {

      // Today
      expect(scope.notPastDates(new Date())).toBeTruthy();

      // Tomorrow
      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate()+1);
      expect(scope.notPastDates(tomorrow)).toBeTruthy();

      // Today at 11:59pm
      var today = new Date();
      today.setHours(23, 59, 59, 999);
      expect(scope.notPastDates(today)).toBeTruthy();

    });

    it('should say the following dates are in the past', function() {

      // Yesterday
      var yesterday = new Date();
      yesterday.setDate(yesterday.getDate()-1);
      expect(scope.notPastDates(yesterday)).toBeFalsy();
    });

    it('should say null and NaN dates are in the future', function() {

      expect(scope.notPastDates(null)).toBeTruthy();
      expect(scope.notPastDates(NaN)).toBeTruthy();
    });

  });

  ddescribe('beforeShowDay support', function () {

    beforeEach(inject(function ($rootScope, $compile) {
      scope = $rootScope;
      scope.bar = new Date();
      scope.onDayRender = jasmine.createSpy('onDayRender');
      element = angular.element('<form name="form">' +
        '<input name="dateInput" id="foo" ng-model="bar" nxg-date-field before-show-day="onDayRender(date)" />' +
        '</form>');
      element = $compile(element)(scope);
      console.log('bleh');
      scope.$digest();
    }));

    it('should cause the before-show-day function to be called with date(s) being rendered', function () {
      expect(scope.onDayRender).toHaveBeenCalled();
      expect(angular.isDate(scope.onDayRender.mostRecentCall.args[0])).toBe(true);
    });

  });

  describe('allow past and future date restriction support', function(){
    var dateAllow = function(pastOrFuture) {
      inject(function ($rootScope, $compile) {
        scope = $rootScope;
        scope.bar = new Date();
        scope.onDayRender = jasmine.createSpy('onDayRender');
        element = angular.element('<form name="form">' +
          '<input name="dateInput" id="foo" ng-model="bar" nxg-date-field date-allow="'+pastOrFuture+'" />' +
          '</form>');
        element = $compile(element)(scope);
        scope.$digest();
      });
    };

    describe('should only allow past values', function() {
      beforeEach(function(){
        dateAllow('past');
      });

      it('with past value', function(){
        spyOn(scope, 'notFutureDates').andReturn(true); //have the date be a past value
        scope.bar = new Date();
        scope.$digest();
        expect(scope.form.dateInput.$error.past).toBeFalsy();
      });

      it('with future value', function(){
        spyOn(scope, 'notFutureDates').andReturn(false); //have the date be a future value
        scope.bar = new Date();
        scope.$digest();
        expect(scope.form.dateInput.$error.past).toBeTruthy();
      });
    });

    describe('should only allow future values', function() {
      beforeEach(function(){
        dateAllow('future');
      });

      it('with past value', function(){
        spyOn(scope, 'notPastDates').andReturn(true); //have the date be a past value
        scope.bar = new Date();
        scope.$digest();
        expect(scope.form.dateInput.$error.future).toBeFalsy();
      });

      it('with future value', function(){
        spyOn(scope, 'notPastDates').andReturn(false); //have the date be a future value
        scope.bar = new Date();
        scope.$digest();
        expect(scope.form.dateInput.$error.future).toBeTruthy();
      });
    });

  });

});
