'use strict';

var DatepickerPageObject = function () {

  this.datepicker = browser.element(by.css('.datepicker'));

  this.datepickerDay = browser.element(by.css('.datepicker-days'));
  this.datepickerDayHeader = this.datepickerDay.element(by.css('.datepicker-switch'));

  this.datepickerMonth = browser.element(by.css('.datepicker-months'));
  this.datepickerMonthHeader = this.datepickerMonth.element(by.css('.datepicker-switch'));

  this.datepickerYear = browser.element(by.css('.datepicker-years'));
  this.datepickerYearPrev = this.datepickerYear.element(by.css('.prev'));
  this.datepickerYearHeader = this.datepickerYear.element(by.css('.datepicker-switch'));
  this.datepickerYearNext = this.datepickerYear.element(by.css('.next'));

  var findYear = function (parentElement, year) {
    var yearElement = parentElement.element(by.cssContainingText('.year', year));
    yearElement.click();
  };

  var findMonth = function (parentElement, month) {
    var monthElement = parentElement.element(by.cssContainingText('.month', month));
    monthElement.click();
  };

  var findDay = function (parentElement, day) {
    // may not work if you enter 1 - 9 as date
    // because cssContainingText might confuse 1 with 11 or 12, 2 with 21 or 12 and so on.
    var dayElement = parentElement.element(by.cssContainingText('.day:not(.old):not(.new)', day));
    dayElement.click();
  };

  this.setDate = function (day, month, year) {
    this.datepickerDayHeader.click();
    this.datepickerMonthHeader.click();

    var prevYear = this.datepickerYearPrev;
    var nextYear = this.datepickerYearNext;

    var datepickerDay = this.datepickerDay;
    var datepickerMonth = this.datepickerMonth;
    var datepickerYear = this.datepickerYear;

    this.datepickerYearHeader.getText().then(function (yearHeader) {
      var years = yearHeader.split('-');
      var i;
      var maxYear = parseInt(years[1]);
      var minYear = parseInt(years[0]);
      if (year > maxYear) {
        var moveYearForward = Math.round((year - maxYear) / 10);
        for (i = 0; i < moveYearForward; i++) {
          nextYear.click();
        }
      } else if (year < minYear) {
        var moveYearBackward = Math.round((minYear - year) / 10);
        for (i = 0; i < moveYearBackward; i++) {
          prevYear.click();
        }
      }

      // http://stackoverflow.com/q/18225997/4351257
      findYear(datepickerYear, year);
      findMonth(datepickerMonth, month);
      findDay(datepickerDay, day);
    });
  };

};

module.exports = DatepickerPageObject;
