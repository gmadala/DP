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

  describe('utc version', function () {

    var momentUTC;
    beforeEach(inject(function ($filter) {
      momentUTC = $filter('momentUTC');
    }));

    it('should work identically to non-utc version for short ISO dates with no time information"', function () {
      // technically if you include the timezone in your format string, this wouldn't hold true, but it's an unlikely case
      var text = '2013-08-07';
      expect(momentUTC(text, usFormat)).toBe('8/7/2013');

      text = '2013-12-25';
      expect(momentUTC(text, usFormat)).toBe('12/25/2013');
    });

    it('should format JavaScript dates to a US date format based on UTC"', function () {
      var date = new Date(2013, 7, 7);
      date.setUTCFullYear(2013);
      date.setUTCMonth(7);
      date.setUTCDate(7);
      expect(momentUTC(date, usFormat)).toBe('8/7/2013');
    });

    it('should read and reformat randomly formatted dates with an input format hint"', function () {
      var text = 'Monday, August 19, 2013';
      expect(momentUTC(text, usFormat, 'dddd, MMMM D, YYYY')).toBe('8/19/2013');
    });

  });

});
