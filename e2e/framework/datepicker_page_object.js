'use strict';

var DatepickerPageObject = function () {

  this.datepicker = browser.element(by.css('.datepicker'));

  this.datepickerDayHeader = browser.element(by.css('.datepicker-days .datepicker-switch'));
  this.dayElements = browser.element.all(by.css('.day'));

  this.datepickerMonthHeader = browser.element(by.css('.datepicker-months .datepicker-switch'));
  this.monthElements = browser.element.all(by.css('.month'));

  this.datepickerYearPrev = browser.element(by.css('.datepicker-years .prev'));
  this.datepickerYearHeader = browser.element(by.css('.datepicker-years .datepicker-switch'));
  this.datepickerYearNext = browser.element(by.css('.datepicker-years .next'));
  this.yearElements = browser.element.all(by.css('.year'));

  var findYear = function (yearElements, year) {
    var deferred = protractor.promise.defer();
    yearElements.each(function (yearElement) {
      yearElement.getText().then(function (yearText) {
        if (parseInt(yearText) === year) {
          deferred.fulfill(yearElement);
        }
      });
    });
    return deferred;
  };

  var findMonth = function (monthElements, month) {
    var deferred = protractor.promise.defer();
    monthElements.each(function (monthElement) {
      monthElement.getText().then(function (monthText) {
        if (monthText === month) {
          deferred.fulfill(monthElement);
        }
      });
    });
    return deferred;
  };

  var findDay = function (dayElements, day) {
    var deferred = protractor.promise.defer();
    dayElements.each(function (dayElement) {
      dayElement.getText().then(function (dayText) {
        if (parseInt(dayText) === day) {
          deferred.fulfill(dayElement);
        }
      });
    });
    return deferred;
  };

  this.setDate = function (day, month, year) {
    this.datepickerDayHeader.click();
    this.datepickerMonthHeader.click();

    var prevYear = this.datepickerYearPrev;
    var nextYear = this.datepickerYearNext;

    var dayElements = this.dayElements;
    var monthElements = this.monthElements;
    var yearElements = this.yearElements;


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

      findYear(yearElements, year).then(function (yearElement) {
        yearElement.click().then(function () {
          findMonth(monthElements, month).then(function (monthElement) {
            monthElement.click().then(function () {
              findDay(dayElements, day).then(function(dayElement) {
                //TODO: incomplete implementation!
                // If I click the dayElement here, then it will just throw error because the findDay is still iterating,
                // but the calendar object is removed from the DOM by the date picker. Need to figure this out.
              });
            });
          });
        });
      });
    });
  };

};

module.exports = DatepickerPageObject;
