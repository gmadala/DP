'use strict';

describe('Filter: moment', function () {

  // load the filter's module
  beforeEach(module('nextgearWebApp'));

  // initialize a new instance of the filter before each test
  var moment,
    usFormat = 'M/D/YYYY';
  beforeEach(inject(function ($filter) {
    moment = $filter('moment');
  }));

  it('should format ISO short dates to a local US date format with no time zone skew"', function () {
    var text = '2013-08-07';
    expect(moment(text, usFormat)).toBe('8/7/2013');

    text = '2013-12-25';
    expect(moment(text, usFormat)).toBe('12/25/2013');
  });

  it('should format JavaScript dates to a local US date format with no time zone skew"', function () {
    var date = new Date(2013, 7, 7);
    expect(moment(date, usFormat)).toBe('8/7/2013');

    date = new Date(2013, 11, 25);
    expect(moment(date, usFormat)).toBe('12/25/2013');
  });

  it('should read and reformat randomly formatted dates with an input format hint"', function () {
    var text = 'Monday, August 19, 2013';
    expect(moment(text, usFormat, 'dddd, MMMM D, YYYY')).toBe('8/19/2013');
  });

});
